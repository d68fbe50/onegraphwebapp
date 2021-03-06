import BaseComponent from './../Base';
import IconButton from '@material-ui/core/IconButton';
import ReplayIcon from '@material-ui/icons/Replay';
import React from 'react';
import { setState, getState } from 'statezero';
import './style.css';

if (process.env.REACT_APP_SW === 'true') {
  try {
    navigator.serviceWorker.addEventListener('message', (event) => {
      setTimeout(async () => {
        if (event.data.meta === 'workbox-broadcast-update') {
          const { cacheName, updatedURL } = event.data.payload;
          if (~updatedURL.indexOf('gacha')) {
            const cache = await caches.open(cacheName);
            const res = await cache.match(updatedURL);
            const resObj = await res.json();
            const newDate = new Date(resObj.material[0].last_updated).getTime();
            const oldDate = new Date(
              JSON.parse(JSON.stringify(getState('gacha'))).last_updated
            ).getTime();
            if (newDate !== oldDate) setState('updateEvent', true);
          }
        }
      }, 3000);
    });
  } catch {
    console.warn('Data maybe not latest.');
  }
}

const eventChange = () => {
  setState('updateEvent', false);
  window.location.reload();
};

function Snack(props) {
  if (!props.open) {
    return null;
  } else {
    setTimeout(() => {
      setState('updateEvent', false);
    }, 10000);
    return (
      <div className="snack">
        <span className="message">数据更新已就绪</span>
        <IconButton aria-label="replay" onClick={eventChange}>
          <ReplayIcon />
        </IconButton>
      </div>
    );
  }
}

class MessageSnack extends BaseComponent {
  filterState({ updateEvent }) {
    return { updateEvent };
  }

  render() {
    return (
      <div>
        <Snack open={this.state.updateEvent} />
      </div>
    );
  }
}

export default MessageSnack;
