const { toTimestamp } = require("../functions/helper.js");
const { decodeData } = require("../utils/nbt.js");

module.exports = async (profile) => {
  const armorPieces = ["helmet", "chestplate", "leggings", "boots"];
  const INV_ARMOR = {
    helmet: [],
    chestplate: [],
    leggings: [],
    boots: [],
  };

  if (profile.inv_armor?.data) {
    const invArmor = (
      await decodeData(Buffer.from(profile.inv_armor?.data, "base64"))
    ).i;
    for (let i = 0; i < invArmor.length; i++) {
      if (invArmor[i].tag?.ExtraAttributes?.rarity_upgrades) {
        invArmor[i].tag.ExtraAttributes.recombobulated =
          invArmor[i].tag.ExtraAttributes.rarity_upgrades === 1 ? true : false;
        delete invArmor[i].tag.ExtraAttributes.rarity_upgrades;
      }

      if (invArmor[i].tag?.ExtraAttributes?.modifier) {
        invArmor[i].tag.ExtraAttributes.reforge = invArmor[i].tag
          .ExtraAttributes.modifier
          ? invArmor[i].tag.ExtraAttributes.modifier
          : "None";
        delete invArmor[i].tag.ExtraAttributes.modifier;
      }

      if (invArmor[i].tag?.ExtraAttributes?.donated_museum) {
        invArmor[i].tag.ExtraAttributes.soulbond =
          invArmor[i].tag?.ExtraAttributes.donated_museum === 1 ? true : false;
        delete invArmor[i].tag.ExtraAttributes.donated_museum;
      }

      if (invArmor[i].tag?.ExtraAttributes?.timestamp) {
        invArmor[i].tag.ExtraAttributes.timestamp =
          toTimestamp(invArmor[i].tag.ExtraAttributes.timestamp) | null;
      }

      INV_ARMOR[armorPieces[i]] = invArmor[i];
    }
  }

  return INV_ARMOR;
};
