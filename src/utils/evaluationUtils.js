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
  let partialCategoriesCount = 0;

  const categoryResults = [];

  categories.forEach((cat) => {
    const result = getResult(cat, answers);

    categoryResults.push({
      id: cat.id,
      title: cat.title,
      ...result,
    });

    if (result.isEmpty) {
      return;
    }

    filledCategoriesCount++;

    if (result.isPartial) {
      partialCategoriesCount++;
    }

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
    partialCategoriesCount,
    isCompletelyEmpty: filledCategoriesCount === 0,
    categoryResults,
    hasPartialCategories: partialCategoriesCount > 0,
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

  const weakCategories = stats.categoryResults
    .filter(
      (cat) =>
        !cat.isEmpty &&
        cat.percentage >= 61 &&
        cat.percentage <= 99 &&
        cat.percentage < 100
    )
    .map((cat) => cat.title);

  const criticalCategories = stats.categoryResults
    .filter(
      (cat) =>
        !cat.isEmpty &&
        cat.percentage <= 60
    )
    .map((cat) => cat.title);

  const weakCatsText = formatCategoryList(weakCategories);
  const criticalCatsText = formatCategoryList(criticalCategories);

  if (!stats.hasMandatoryFails) {
    if (stats.percentage === 100) {
      return "Aplikace plně vyhovuje sledovaným kritériím. Všechny klíčové oblasti jsou pokryty.";
    }

    if (stats.percentage >= 61) {
      if (stats.hasPartialCategories) {
        return "Na základě dosud vyplněných kritérií aplikace splňuje většinu sledovaných požadavků. Hodnocení však není úplné, protože některé kategorie nejsou zcela vyplněny.";
      }

      return "Aplikace splňuje většinu sledovaných kritérií.";
    }

    return "Aplikace má kritické nedostatky a vyžaduje zásadní přepracování.";
  }

  if (stats.percentage <= 60) {
    if (stats.hasPartialCategories) {
      return `Na základě dosud vyplněných kritérií aplikace vykazuje kritické nedostatky a vyžaduje zásadní přepracování v oblasti/ech: ${failedCatsText}.`;
    }

    return `Aplikace má kritické nedostatky a vyžaduje zásadní přepracování v oblasti/ech: ${failedCatsText}.`;
  }

  if (stats.percentage >= 61 && stats.percentage <= 99) {
  // 1) Nejdřív nejpřesnější rozlišení:
  // kombinace "slabších" a "kritických" kategorií
  if (criticalCategories.length > 0 && weakCategories.length > 0) {
    if (stats.hasPartialCategories) {
      return `Na základě dosud vyplněných kritérií aplikace sice celkově splňuje většinu sledovaných požadavků, ale vykazuje nedostatky v kategorii/ích: ${weakCatsText} a současně vyžaduje zásadní přepracování v kategorii/ích: ${criticalCatsText}.`;
    }

    return `Aplikace sice celkově splňuje většinu sledovaných požadavků, ale vykazuje nedostatky v kategorii/ích: ${weakCatsText} a současně vyžaduje zásadní přepracování v kategorii/ích: ${criticalCatsText}.`;
  }

  // 2) Jen kritické kategorie
  if (criticalCategories.length > 0) {
    if (stats.hasPartialCategories) {
      return `Na základě dosud vyplněných kritérií aplikace sice celkově splňuje většinu sledovaných požadavků, ale vyžaduje zásadní přepracování v kategorii/ích: ${criticalCatsText}.`;
    }

    return `Aplikace sice celkově splňuje většinu sledovaných požadavků, ale vyžaduje zásadní přepracování v kategorii/ích: ${criticalCatsText}.`;
  }

  // 3) Jen slabší kategorie
  if (weakCategories.length > 0) {
    if (weakCategories.length === 1) {
      if (stats.hasPartialCategories) {
        return `Na základě dosud vyplněných kritérií aplikace vykazuje vysokou kvalitu a splňuje téměř všechna sledovaná kritéria. Slabiny se zatím projevují pouze v kategorii: ${weakCatsText}.`;
      }

      return `Aplikace vykazuje vysokou kvalitu a splňuje téměř všechna sledovaná kritéria. Slabiny se projevují pouze v kategorii: ${weakCatsText}.`;
    }

    if (stats.hasPartialCategories) {
      return `Na základě dosud vyplněných kritérií aplikace sice splňuje většinu sledovaných požadavků, ale stále vykazuje nedostatky v kategorii/ích: ${weakCatsText}.`;
    }

    return `Aplikace sice splňuje většinu sledovaných požadavků, ale stále vykazuje nedostatky v kategorii/ích: ${weakCatsText}.`;
  }

  // 4) Až teprve jako obecná záložní formulace
  if (failedCount === stats.filledCategoriesCount) {
    if (stats.hasPartialCategories) {
      return "Na základě dosud vyplněných kritérií aplikace sice splňuje většinu sledovaných požadavků, avšak žádná z dosud hodnocených kategorií není bez výhrad.";
    }

    return "Aplikace sice splňuje většinu sledovaných kritérií, ale žádná z hodnocených kategorií není splněna bez výhrad.";
  }

  if (stats.hasPartialCategories) {
    return `Na základě dosud vyplněných kritérií aplikace sice splňuje většinu sledovaných požadavků, ale stále má nedostatky v oblasti/ech: ${failedCatsText}.`;
  }

  return `Aplikace sice splňuje většinu sledovaných kritérií, ale stále má nedostatky v oblasti/ech: ${failedCatsText}.`;
}

  if (stats.percentage === 100) {
    return "Aplikace plně vyhovuje sledovaným kritériím. Všechny klíčové oblasti jsou pokryty.";
  }

  return "";
};