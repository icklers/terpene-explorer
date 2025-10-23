function validateTerpene(terpene) {
  const errors = [];

  if (!terpene.id) {
    errors.push('Missing id');
  }
  if (!terpene.name) {
    errors.push('Missing name');
  }
  if (!terpene.aroma) {
    errors.push('Missing aroma');
  }
  if (!terpene.effects || !Array.isArray(terpene.effects)) {
    errors.push('Missing or invalid effects');
  }

  return errors;
}

function validateTerpenes(terpenes) {
  const allErrors = [];
  terpenes.forEach(terpene => {
    const errors = validateTerpene(terpene);
    if (errors.length > 0) {
      allErrors.push({ terpene: terpene.name, errors });
    }
  });
  return allErrors;
}

export { validateTerpenes };
