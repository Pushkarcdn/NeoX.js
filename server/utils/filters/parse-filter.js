const parseFilter = (pageNo, size, sort) => {
  const page = pageNo ? Math.abs(pageNo) : 1;
  const limit = size ? Math.abs(size) : 10;
  const sortVal = sort ? (sort === "desc" ? "DESC" : "ASC") : "DESC";
  const offset = (page - 1) * limit;

  return { limit, page, sortVal, offset };
};

module.exports = parseFilter;
