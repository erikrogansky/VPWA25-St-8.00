import { api } from 'src/boot/axios';
import axios from 'axios';
import { QVueGlobals } from 'quasar';

export const parseCommand = async (command: string, props: { title: string }, $q: QVueGlobals) => {
  const parsedArray = command.split(' ');
  const action = parsedArray[0];
  const entityName = parsedArray[1];
  const channelSettings = parsedArray[2];

  if (!entityName) {
    $q.notify({
      position: 'top',
      type: 'negative',
      message: 'Please provide a name.',
    });
    return;
  }
  if (channelSettings && !['private'].includes(channelSettings)) {
    $q.notify({
      position: 'top',
      type: 'negative',
      message: 'Invalid channel settings.',
    });
    return;
  }


  try {
    let response;
    switch (action) {
      // Invite
      case '/invite':
        response = await api.post('/send-invite', { userName: entityName, channelName: props.title });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'Invitation sent!',
        });
        break;
      // Revoke
      case '/revoke':
        response = await api.post('/revoke-user', { userName: entityName, channelName: props.title });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'User revoked successfully!',
        });
        break;
      // Kick
      case '/kick':
        response = await api.post('/kick-user', { userName: entityName, channelName: props.title });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'User kicked successfully!',
        });
        break;
      case '/join':
        response = await api.post('/join-channel', { channelName: entityName, channelSettings: channelSettings });
        $q.notify({
          position: 'top',
          type: 'positive',
          message: response.data.message || 'Joined channel successfully!',
        });
        break;
      default:

        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Invalid command!',
        });
    }
  } catch (error) {
    // potom mozno zmenit na swtich a zmenit poradie
    if (axios.isAxiosError(error) && error.response ) {
      // Already a member
      if(error.response.status === 400 && error.response.data.message === 'Already a member') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'You are already a member of this channel.',
        });
      // Private channel
      } else if (error.response.status === 403 && error.response.data.message === 'Private channel') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Cannot join a private channel.',
        });
      // Channel not found
      } else if (error.response.status === 404 && error.response.data.message === 'Channel not found') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Channel not found.',
        });
      // User not found
      } else if (error.response.status === 404 && error.response.data.message === 'User not found') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User not found',
        });
      // Invites - Only admin invites (private channel)
      } else if (error.response.status === 403 && error.response.data.message === 'OnlyAdminInvites') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Only the channel admin can send invites.',
        });
      // Invites - User error - not a member
      } else if (error.response.status === 403 && error.response.data.message === 'You are not a member of this channel') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'You are not a member of this channel',
        });
      // Invites - User error - already a member
      } else if (error.response.status === 400 && error.response.data.message === 'InviteAlreadyMember') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User is already a member of this channel',
        });
      // Revoke - Only admin revokes
      } else if (error.response.status === 403 && error.response.data.message === 'OnlyAdminRevoke') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Only the channel admin can revoke users.',
        });
      // User not in channel
      } else if (error.response.status === 400 && error.response.data.message === 'UserNotInChannel') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User is not in this channel.',
        });
      // Admin cannot revoke self
      } else if (error.response.status === 400 && error.response.data.message === 'AdminCannotRevokeSelf') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Unable to remove user. (Channel Admin)',
        });
      } else if (error.response.status === 400 && error.response.data.message === 'UserAlreadyBanned') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User is already banned from this channel.',
        });
      } else if (error.response.status === 403 && error.response.data.message === 'UserBanned') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'User is banned from the channel.',
        });
      }  else if (error.response.status === 403 && error.response.data.message === 'CannotKickChannelAdmin') {
        $q.notify({
          position: 'top',
          type: 'negative',
          message: 'Cannot kick the channel admin.',
        });
      }
    } else {
      $q.notify({
        position: 'top',
        type: 'negative',
        message: 'An error occurred while processing the commandos.',
      });
    }
  }
};
