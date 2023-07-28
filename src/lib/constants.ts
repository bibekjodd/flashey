export const dummyUserImage =
  "https://avatars.githubusercontent.com/u/110604197?v=4";

export const dummyGroupImage =
  "https://m.economictimes.com/thumb/msid-100708795,width-1920,height-1280,resizemode-4,imgsize-177908/wwe-friday-night-smackdown-will-roman-reigns-unveil-new-wwe-universal-championship.jpg";

export const EVENTS = {
  MESSAGE_SENT: "message-sent",
  MESSAGE_VIEWED: "message-viewed",

  REACTION_ADDED: "reaction-added",
  REACTION_REMOVED: "reaction-removed",

  CREATED_GROUP_CHAT: "created-group-chat",
  ADDED_TO_GROUP: "added-to-group",
  REMOVED_FROM_GROUP: "removed-from-group",
  GROUP_RENAMED: "renamed-group",

  TYPING: "typing",
};

export const reactions = [
  ["haha", "😁"],
  ["love", "💖"],
  ["wow", "😲"],
  ["angry", "😡"],
  ["sad", "☹️"],
];

export const mapReactions: Record<string, string> = {
  haha: "😁",
  love: "💖",
  wow: "😲",
  angry: "😡",
  sad: "☹️",
};
