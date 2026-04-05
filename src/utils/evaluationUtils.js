export const getResult = (cat, answers) => {
  let totalWeight = 0;
  let yesWeight = 0;
  let naCount = 0;

  cat.items.forEach((item) => {
    const value = answers[`${cat.id}-${item.id}`];

    if (value === "na") {
      naCount++;
      return;
    }

    totalWeight += item.weight;

    if (value === true) {
      yesWeight += item.weight;
    }
  });

  const percentage =
    totalWeight > 0 ? Math.round((yesWeight / totalWeight) * 100) : 0;

  let color = "red";
  if (percentage >= 90) color = "green";
  else if (percentage >= 61) color = "orange";

  return {
    totalWeight,
    yesWeight,
    percentage,
    color,
    naCount,
  };
};

const getFailedMandatoryItems = (cat, answers) => {
  return cat.items.filter((item) => {
    const value = answers[`${cat.id}-${item.id}`];
    return (item.weight === 2 || item.weight === 3) && value === false;
  });
};

export const globalStats = (categories, answers) => {
  let totalWeight = 0;
  let yesWeight = 0;
  let naCount = 0;

  let criticalFails = [];
  let categoriesWithMandatoryFails = [];

  categories.forEach((cat) => {
    cat.items.forEach((item) => {
      const value = answers[`${cat.id}-${item.id}`];

      if (value === "na") {
        naCount++;
        return;
      }

      totalWeight += item.weight;

      if (value === true) {
        yesWeight += item.weight;
      }
    });

    const failedMandatory = getFailedMandatoryItems(cat, answers);

    if (failedMandatory.length > 0) {
      criticalFails.push({
        category: cat.title,
        items: failedMandatory,
      });

      categoriesWithMandatoryFails.push(cat.title);
    }
  });

  const percentage =
    totalWeight > 0 ? Math.round((yesWeight / totalWeight) * 100) : 0;

  return {
    totalWeight,
    yesWeight,
    percentage,
    naCount,
    criticalFails,
    categoriesWithMandatoryFails: [...new Set(categoriesWithMandatoryFails)],
    hasMandatoryFails: criticalFails.length > 0,
  };
};

const formatCategoryList = (categories) => {
  if (!categories || categories.length === 0) return "";
  return [...new Set(categories)].join(", ");
};

export const generateSummary = (categories, answers) => {
  const stats = globalStats(categories, answers);

  if (!stats.hasMandatoryFails) {
    if (stats.percentage <= 60) {
      return "Aplikace vyhovuje základním kritériím, ale existuje prostor pro zlepšení.";
    }

    if (stats.percentage <= 89) {
      return "Aplikace splňuje většinu sledovaných kritérií, ale zůstává prostor pro potenciální rozvoj.";
    }

    return "Aplikace plně vyhovuje sledovaným kritériím. Všechny klíčové oblasti jsou pokryty a nevykazují zásadní nedostatky.";
  }

  const failedCats = formatCategoryList(stats.categoriesWithMandatoryFails);

  if (stats.percentage <= 60) {
    return `Aplikace má kritické nedostatky a vyžaduje zásadní přepracování v oblasti/ech: ${failedCats}.`;
  }

  if (stats.percentage <= 89) {
    return `Aplikace splňuje většinu sledovaných kritérií, ale potřebuje podstatné změny v oblasti/ech: ${failedCats}.`;
  }

  return `Aplikace vykazuje vysokou kvalitu, ale má nedostatky v oblasti/ech: ${failedCats}.`;
};