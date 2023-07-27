import Pusher from "pusher-js";

const pusher_key = import.meta.env.VITE_PUSHER_KEY;
const pusher_cluster = import.meta.env.VITE_PUSHER_CLUSTER;

const pusher = new Pusher(pusher_key, {
  cluster: pusher_cluster,
});

export default pusher;
