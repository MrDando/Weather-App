function getName(location) {
  const types = ['city', 'town', 'village', 'hamlet', 'city_district'];
  let locationName;
  types.forEach((type) => {
    if (location.components.hasOwnProperty(type)) {
      locationName = location.components[type];
    }
  });
  return locationName;
}

export { getName as default };
