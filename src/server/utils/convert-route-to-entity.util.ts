const mapping: Record<string, string> = {
  'carbon-offset-investors': 'carbon_offset_investor',
  'csr-investors': 'csr_investor',
  customers: 'customer',
  'gov-subsidy-providers': 'gov_subsidy_provider',
  'micro-entrepreneurs': 'micro_entrepreneur',
  platforms: 'platform',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
