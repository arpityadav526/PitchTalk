export const extractArray = (data, possibleKeys = []) => {
  if (Array.isArray(data)) return data;

  for (const key of possibleKeys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;

  return [];
};

export const extractObject = (data, possibleKeys = []) => {
  if (!data || typeof data !== "object") return null;

  for (const key of possibleKeys) {
    if (data?.[key] && typeof data[key] === "object" && !Array.isArray(data[key])) {
      return data[key];
    }
  }

  if (data?.data && typeof data.data === "object" && !Array.isArray(data.data)) {
    return data.data;
  }

  return data;
};