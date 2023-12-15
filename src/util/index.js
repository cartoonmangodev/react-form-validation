export { newObject, typeOf } from "./helpers";

const _uniqueId = {};
export const generateTimeStamp = () => new Date().getTime();
export const generateUniqueId = function generateUniqueId() {
  const __uniqueId = Math.floor(Math.random() * generateTimeStamp());
  if (_uniqueId[__uniqueId]) return generateUniqueId();
  _uniqueId[__uniqueId] = __uniqueId;
  return __uniqueId;
};

export const deleteUniqueId = (id) => delete _uniqueId[id];
