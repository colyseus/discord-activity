var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { DiscordSDK, DiscordSDKMock } from '@discord/embedded-app-sdk';
export const DISCORD_CLIENT_ID = import.meta.env.VITE_DISCORD_CLIENT_ID;
const queryParams = new URLSearchParams(window.location.search);
const isEmbedded = queryParams.get('frame_id') != null;
let discordSDK;
if (isEmbedded) {
    // Discord Client ID for the embedded app
    discordSDK = new DiscordSDK(DISCORD_CLIENT_ID);
}
else {
    let SessionStorageQueryParam;
    (function (SessionStorageQueryParam) {
        SessionStorageQueryParam["user_id"] = "user_id";
        SessionStorageQueryParam["guild_id"] = "guild_id";
        SessionStorageQueryParam["channel_id"] = "channel_id";
    })(SessionStorageQueryParam || (SessionStorageQueryParam = {}));
    function getOverrideOrRandomSessionValue(queryParam) {
        const overrideValue = queryParams.get(queryParam);
        if (overrideValue != null) {
            return overrideValue;
        }
        const currentStoredValue = sessionStorage.getItem(queryParam);
        if (currentStoredValue != null) {
            return currentStoredValue;
        }
        // Set queryParam to a random 8-character string
        const randomString = Math.random().toString(36).slice(2, 10);
        sessionStorage.setItem(queryParam, randomString);
        return randomString;
    }
    // We're using session storage for "user_id" and "guild_id"
    // This way the user/guild/channel will be maintained until the tab is closed, even if you refresh
    // Session storage will generate new unique mocks for each tab you open
    // Any of these values can be overridden via query parameters
    // i.e. if you set https://my-tunnel-url.com/?user_id=test_user_id
    // this will override this will override the session user_id value
    const mockUserId = getOverrideOrRandomSessionValue('user_id');
    const mockGuildId = getOverrideOrRandomSessionValue('guild_id');
    const mockChannelId = 'dummyChannelId';
    // const mockChannelId = getOverrideOrRandomSessionValue('channel_id');
    discordSDK = new DiscordSDKMock(DISCORD_CLIENT_ID, mockGuildId, mockChannelId, 'en');
    const discriminator = String(mockUserId.charCodeAt(0) % 5);
    discordSDK._updateCommandMocks({
        authenticate: () => __awaiter(void 0, void 0, void 0, function* () {
            return yield {
                access_token: 'mock_token',
                user: { username: mockUserId, discriminator, id: mockUserId, avatar: null, public_flags: 1, },
                scopes: [],
                expires: new Date(2112, 1, 1).toString(),
                application: {
                    description: 'mock_app_description',
                    icon: 'mock_app_icon',
                    id: 'mock_app_id',
                    name: 'mock_app_name',
                },
            };
        }),
    });
}
export { discordSDK, isEmbedded };
