const ApiError = require('../utils/ApiError');
const httpStatus = require('../utils/httpStatus');
const narrates = require('../data/list.json');
const { omit } = require('../utils/utility');

const hadithsImported = () => {
  const hadiths = {};
  narrates.forEach((narrator) => {
    hadiths[narrator.slug] = require(`../data/${narrator.slug}.json`);
  });
  return hadiths;
};

const hadiths = hadithsImported();

const getNarrates = () => narrates;

const getNarratorBySlug = (slug) => {
  return getNarrates().find((n) => n.slug === slug);
};

// Fungsi getHadiths tanpa paginasi
const getHadiths = (narrator) => {
  const narratorBySlug = getNarratorBySlug(narrator);

  if (!narratorBySlug) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Narrator not found');
  }

  // Tidak ada pagination, cukup kembalikan semua hadith
  return {
    ...narratorBySlug,
    items: hadiths[narrator],
  };
};

const getHadith = (narrator, number) => {
  const narratorBySlug = getNarratorBySlug(narrator);

  if (!narratorBySlug) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Narrator not found');
  }

  const hadith = hadiths[narratorBySlug.slug].find(
    (h) => h.number === Number(number)
  );

  if (!hadith) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Hadith not found');
  }

  return {
    ...omit(narratorBySlug, 'total'),
    ...hadith,
  };
};

module.exports = { getNarrates, getHadiths, getHadith };
