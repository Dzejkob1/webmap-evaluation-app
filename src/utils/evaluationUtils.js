export const getResult = (cat, answers) => {
  let totalWeight = 0;
  let yesWeight = 0;
  let naCount = 0;
  let answeredCount = 0;

  const totalItems = cat.items.length;
  const applicableItems = cat.items.filter((item) => {
    const value = answers[`${cat.id}-${item.id}`];
    return value !== "na";
  }).length;

  cat.items.forEach((item) => {
    const value = answers[`${cat.id}-${item.id}`];

    if (value === undefined) {
      return;
    }

    if (value === "na") {
      naCount++;
      return;
    }

    answeredCount++;
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

  const isEmpty = answeredCount === 0 && naCount === 0;
  const isPartial =
    !isEmpty &&
    answeredCount + naCount < totalItems;

  const isComplete =
    !isEmpty &&
    answeredCount + naCount === totalItems;

  return {
    totalWeight,
    yesWeight,
    percentage,
    color,
    naCount,
    answeredCount,
    totalItems,
    applicableItems,
    isEmpty,
    isPartial,
    isComplete,
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
  let filledCategoriesCount = 0;

  categories.forEach((cat) => {
    const result = getResult(cat, answers);

    if (result.isEmpty) {
      return;
    }

    filledCategoriesCount++;

    totalWeight += result.totalWeight;
    yesWeight += result.yesWeight;
    naCount += result.naCount;

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
    filledCategoriesCount,
    isCompletelyEmpty: filledCategoriesCount === 0,
  };
};

const formatCategoryList = (categories) => {
  if (!categories || categories.length === 0) return "";
  return [...new Set(categories)].join(", ");
};

export const generateSummary = (categories, answers) => {
  const stats = globalStats(categories, answers);

  if (stats.isCompletelyEmpty) {
    return "";
  }

  const failedCategories = [...new Set(stats.categoriesWithMandatoryFails)];
  const failedCatsText = formatCategoryList(failedCategories);
  const failedCount = failedCategories.length;

  if (!stats.hasMandatoryFails) {
    if (stats.percentage === 100) {
      return "Aplikace plně vyhovuje sledovaným kritériím. Všechny klíčové oblasti jsou pokryty.";
    }

    if (stats.percentage >= 61) {
      return "Aplikace splňuje většinu sledovaných kritérií.";
    }

    return "Aplikace má kritické nedostatky a vyžaduje zásadní přepracování.";
  }

  if (stats.percentage <= 60) {
    return `Aplikace má kritické nedostatky a vyžaduje zásadní přepracování v oblasti/ech: ${failedCatsText}.`;
  }

 if (stats.percentage >= 61 && stats.percentage <= 99) {

  // 🔴 nová podmínka – žádná kategorie není 100%
  if (failedCount === stats.filledCategoriesCount) {
    return "Aplikace sice splňuje většinu sledovaných kritérií, ale žádná z hodnocených kategorií není splněna bez výhrad.";
  }

  if (failedCount === 1) {
    return `Aplikace vykazuje vysokou kvalitu a splňuje téměř všechna kritéria. Má slabiny pouze v kategorii: ${failedCatsText}.`;
  }

  return `Aplikace sice splňuje většinu sledovaných kritérií, ale stále má nedostatky v oblasti/ech: ${failedCatsText}.`;
}

  if (stats.percentage === 100) {
    return "Aplikace plně vyhovuje sledovaným kritériím. Všechny klíčové oblasti jsou pokryty.";
  }

  return "";
};