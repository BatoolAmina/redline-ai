const roleRank = { viewer: 1, editor: 2, owner: 3 };

export function canAccess(role, requiredRole = "viewer") {
  return Boolean(role && roleRank[role] >= roleRank[requiredRole]);
}
