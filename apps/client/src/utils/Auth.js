var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { colyseusSDK } from "./Colyseus.js";
import { DISCORD_CLIENT_ID, discordSDK } from "./DiscordSDK.js";
export function authenticate() {
    return __awaiter(this, void 0, void 0, function* () {
        yield discordSDK.ready();
        // Authorize with Discord Client
        const { code } = yield discordSDK.commands.authorize({
            client_id: DISCORD_CLIENT_ID,
            response_type: 'code',
            state: '',
            prompt: 'none',
            // More info on scopes here: https://discord.com/developers/docs/topics/oauth2#shared-resources-oauth2-scopes
            scope: [
                // Activities will launch through app commands and interactions of user-installable apps.
                // https://discord.com/developers/docs/tutorials/developing-a-user-installable-app#configuring-default-install-settings-adding-default-install-settings
                // 'applications.commands',
                // "applications.builds.upload",
                // "applications.builds.read",
                // "applications.store.update",
                // "applications.entitlements",
                // "bot",
                'identify',
                // "connections",
                // "email",
                // "gdm.join",
                'guilds',
                // "guilds.join",
                'guilds.members.read',
                // "messages.read",
                // "relationships.read",
                // 'rpc.activities.write',
                // "rpc.notifications.read",
                // "rpc.voice.write",
                'rpc.voice.read',
                // "webhook.incoming",
            ],
        });
        // Retrieve an token and userdata from your embedded app's server
        const { data } = yield colyseusSDK.http.post('/discord_token', {
            headers: { 'Content-Type': 'application/json', },
            body: JSON.stringify({ code, }),
        });
        if (!data.access_token) {
            throw new Error('Check if your "Discord Client ID" and "Secret" are correct in your server-side.');
        }
        //
        // Authenticate with the token, so we can use the Discord API
        // This is required to listen to SPEAKING events
        //
        yield discordSDK.commands.authenticate({ access_token: data.access_token, });
        return data;
    });
}
