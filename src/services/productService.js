const Product = require("../models/product");
const productService = {
  getProductByCategoryService: async (limit, page, categoryName) => {
    // console.log("queryString>>> ", queryString);
    let offset = (page - 1) * limit;
    // const { filter, skip } = aqp(queryString);
    // console.log("filter>>> ", filter, "skip>>> ", skip);
    // delete filter.page;
    const products = await Product.find({ category: categoryName })
      .skip(offset)
      .limit(limit)
      .exec();
    return products;
  },

  //GET ALL PRODUCTS
  getAllProductsService: async (
    limit,
    page,
    name,
    category,
    brand,
    sort,
    filterPrice
  ) => {
    let offset = (page - 1) * limit;
    console.log("=>>> ", name, category, brand, sort, filterPrice);
    const products = await Product.find({
      $and: [name, category, brand, filterPrice],
      // $and: [{}, {}, {}, {}],
      // $or: [{ name: name }, { category: category }],
    })
      // .sort({ priceAfter: 1 })
      .sort(sort)
      .collation({ locale: "en_US", numericOrdering: true })

      .skip(offset)
      .limit(limit);
    // .exec();
    console.log("products>>> ", products);
    const count = await Product.find({
      $and: [name, category, brand, filterPrice],
    }).count();
    console.log("count>> ", count);
    return { products, count };
  },
};
module.exports = productService;
