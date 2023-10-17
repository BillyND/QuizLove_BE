// Filter by page and limit
function paginateArray(data, page, limit) {
  try {
    const startIndex = (page - 1) * limit;
    const endIndex = parseInt(startIndex) + parseInt(limit);
    return data.slice(startIndex, endIndex);
  } catch (error) {
    return data;
  }
}

module.exports = { paginateArray };
