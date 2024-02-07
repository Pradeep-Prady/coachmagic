class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword;
    if (keyword) {
      this.query.find({
        $or: [
          { domain: { $regex: keyword, $options: "i" } },
          { preceding: { $regex: keyword, $options: "i" } },
          { existing: { $regex: keyword, $options: "i" } },
          { "skills.skill": { $regex: keyword, $options: "i" } },
          { name: { $regex: keyword, $options: "i" } },
        ],
      });
    }
    return this;
  }

  tag() {
    const queryStrCopy = { ...this.queryStr };

    const removeFields = ["keyword", "limit", "page"];
    removeFields.forEach((field) => delete queryStrCopy[field]);

    let query = this.query;

    const { tag1, tag2, tag3 } = this.queryStr;

    if (tag1 || tag2 || tag3) {
      const tagQuery = {
        $or: [],
      };

      if (tag1) {
        tagQuery.$or.push({ tag: { $regex: tag1, $options: "i" } });
      }
      if (tag2) {
        tagQuery.$or.push({ tag: { $regex: tag2, $options: "i" } });
      }
      if (tag3) {
        tagQuery.$or.push({ tag: { $regex: tag3, $options: "i" } });
      }

      query = query.find(tagQuery);
    }

    return this;
  }

  exp() {
    const expKey1 = this.queryStr.exp1;
    const expKey2 = this.queryStr.exp2;
    const expKey3 = this.queryStr.exp3;
    const expKey4 = this.queryStr.exp4;
    const expKey5 = this.queryStr.exp5;

    if (expKey5) {
      this.query.find({
        "skills.yearsOfExp": { $gte: 9 },
      });
    }
    if (expKey4) {
      this.query.find({
        "skills.yearsOfExp": { $gte: 7, $lte: 8 },
      });
    }
    if (expKey3) {
      this.query.find({
        "skills.yearsOfExp": { $gte: 4, $lte: 6 },
      });
    }
    if (expKey2) {
      this.query.find({
        "skills.yearsOfExp": { $gte: 2, $lte: 4 },
      });
    }
    if (expKey1) {
      this.query.find({
        "skills.yearsOfExp": { $gte: 1 },
      });
    }

    return this;
  }

  paginate(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
