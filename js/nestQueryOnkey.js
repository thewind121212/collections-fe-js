function getNestedValue(item : any, keys: string[]) {
  // Loop through each key in the keys array
  return keys.reduce((acc: Record<string, any>, key) => {
    if (acc && acc.hasOwnProperty(key)) {
      return acc[key];  
    }
    return undefined;  
  }, item);  
}
