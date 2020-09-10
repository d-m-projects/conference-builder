// DataSource for antd Table requires keys in each object entry
// Just remap id to key
export function formatDataSource(source) {
  return source.map((obj) => {
    return {
      key: obj.id,
      ...obj,
    };
  });
}
