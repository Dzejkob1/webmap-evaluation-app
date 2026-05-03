const flattenItems = (items) => {
  return items.flatMap((item) => {
    if (item.subitems?.length > 0) {
      return item.subitems.map((sub) => ({
        ...sub,
        id: `${item.id}-${sub.id}`,
        weight: sub.weight ?? item.weight,
        parentText: item.text,
      }));
    }

    return [item];
  });
};

export const getResult = (cat, answers) => {
  let totalWeight = 0;
  let yesWeight = 0;
  let naCount = 0;
  let answeredCount = 0;

  const flatItems = flattenItems(cat.items);
  const totalItems = flatItems.length;

  const applicableItems = flatItems.filter((item) => {
    const value = answers[`${cat.id}-${item.id}`];
    return value !== "unknown" && value !== "na";
  }).length;

  flatItems.forEach((item) => {
    const value = answers[`${cat.id}-${item.id}`];

    if (value === undefined) return;

    if (value === "unknown" || value === "na") {
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
  return flattenItems(cat.items).filter((item) => {
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

    if (result.isEmpty) return;

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

export const generateSummary = (categories, answers, lang = "cs") => {
  const stats = globalStats(categories, answers);

  if (stats.isCompletelyEmpty) {
    return "";
  }

  const t = {
    cs: {
      incomplete:
        "Nejsou zodpovězena všechna kritéria. Výsledné hodnocení je proto pouze orientační.",
      full:
        "Aplikace plně vyhovuje sledovaným kritériím. Všechny klíčové oblasti jsou pokryty.",
      mostlyAll:
        "Aplikace sice splňuje většinu sledovaných kritérií, ale vykazuje částečné nedostatky ve všech kategoriích.",
      mostlySome:
        "Aplikace sice splňuje většinu sledovaných kritérií, ale má nedostatky v oblasti/ech: ",
      criticalAll:
        "Aplikace má kritické nedostatky a vyžaduje zásadní přepracování ve všech oblastech.",
      criticalSome:
        "Aplikace má kritické nedostatky a vyžaduje zásadní přepracování v oblasti/ech: ",
    },
    en: {
      incomplete:
        "Not all criteria have been answered. The final evaluation is therefore only indicative.",
      full:
        "The application fully meets the evaluated criteria. All key areas are covered.",
      mostlyAll:
  "While the application meets most of the evaluated criteria, it exhibits partial shortcomings across all categories.",

mostlySome:
  "While the application meets most of the evaluated criteria, it shows shortcomings in: ",
      criticalAll:
        "The application has critical shortcomings and requires major revision in all areas.",
      criticalSome:
        "The application has critical shortcomings and requires major revision in: ",
    },
  };

  const text = lang === "en" ? t.en : t.cs;

  const hasIncompleteCategories = stats.categoryResults.some(
  (cat) => cat.isEmpty || cat.isPartial
);

if (hasIncompleteCategories) {
  return text.incomplete;
}

  if (stats.percentage === 100) {
    return text.full;
  }

  const failedCategories = [...new Set(stats.categoriesWithMandatoryFails)];
  const failedCatsText = formatCategoryList(failedCategories);
  const allFilledCategoriesFailed =
    failedCategories.length === stats.filledCategoriesCount;

  if (stats.percentage >= 61 && stats.percentage <= 99) {
    if (allFilledCategoriesFailed) {
      return text.mostlyAll;
    }

    return `${text.mostlySome}${failedCatsText}.`;
  }

  if (stats.percentage <= 60) {
    if (allFilledCategoriesFailed) {
      return text.criticalAll;
    }

    return `${text.criticalSome}${failedCatsText}.`;
  }

  return "";
};