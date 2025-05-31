const FIELD_MAP = {
  SPEND: 'totalSpend',
  VISITS: 'visits',
  LASTACTIVE: 'lastActive',
  NAME: 'name',          
  EMAIL: 'email',
  PHONE: 'phone',
};

function parseRuleToMongoQuery(ruleText) {
  if (!ruleText || typeof ruleText !== 'string') {
    throw new Error('Rules must be a non-empty string');
  }
  ruleText = ruleText.toUpperCase().replace(/\s+/g, ' ').trim();
  const orParts = ruleText.split(' OR ');

  const orConditions = orParts.map(orPart => {
    const andParts = orPart.split(' AND ');

    const andConditions = andParts.map(condStr => {
      const stringMatch = condStr.match(/^(\w+)\s*=\s*"(.+)"$/);
      if (stringMatch) {
        const [, field, value] = stringMatch;
        const fieldKey = FIELD_MAP[field];
        if (!fieldKey) throw new Error('Unknown field: ' + field);
        return { [fieldKey]: value };
      }
      const match = condStr.match(/^(\w+)\s*(>=|<=|=|>|<)\s*(\d+)$/);
      if (!match) throw new Error('Invalid condition: ' + condStr);

      const [, field, operator, valueStr] = match;
      const value = Number(valueStr);
      const fieldKey = FIELD_MAP[field];
      if (!fieldKey) throw new Error('Unknown field: ' + field);

      switch (operator) {
        case '>': return { [fieldKey]: { $gt: value } };
        case '<': return { [fieldKey]: { $lt: value } };
        case '>=': return { [fieldKey]: { $gte: value } };
        case '<=': return { [fieldKey]: { $lte: value } };
        case '=': return { [fieldKey]: value };
        default: throw new Error('Unsupported operator: ' + operator);
      }
    });

    if (andConditions.length === 1) return andConditions[0];
    return { $and: andConditions };
  });

  if (orConditions.length === 1) return orConditions[0];
  return { $or: orConditions };
}

module.exports = { parseRuleToMongoQuery };
