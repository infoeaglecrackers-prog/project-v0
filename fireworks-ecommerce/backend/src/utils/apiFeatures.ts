import { FilterQuery, Query } from "mongoose";

interface QueryString {
  keyword?: string;
  page?: string;
  limit?: string;
  sort?: string;
  [key: string]: unknown;
}

class ApiFeatures<T> {
  public query: Query<T[], T>;
  private queryStr: QueryString;

  constructor(query: Query<T[], T>, queryStr: QueryString) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search(): this {
    if (this.queryStr.keyword) {
      const keyword: FilterQuery<T> = {
        $or: [
          { name: { $regex: this.queryStr.keyword, $options: "i" } },
          { description: { $regex: this.queryStr.keyword, $options: "i" } },
          { tags: { $regex: this.queryStr.keyword, $options: "i" } },
        ],
      } as FilterQuery<T>;
      this.query = this.query.find(keyword);
    }
    return this;
  }

  filter(): this {
    const queryCopy: Record<string, unknown> = { ...this.queryStr };
    const removeFields = ["keyword", "page", "limit", "sort"];
    removeFields.forEach((k) => delete queryCopy[k]);

    // Support comma-separated category IDs for multi-select: ?category=id1,id2
    if (typeof queryCopy.category === "string" && queryCopy.category.includes(",")) {
      queryCopy.category = { $in: queryCopy.category.split(",").map((s) => s.trim()) };
    }

    // Convert price[gte] → $gte, etc.
    let queryStr = JSON.stringify(queryCopy);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (key) => `$${key}`);

    this.query = this.query.find(JSON.parse(queryStr) as FilterQuery<T>);
    return this;
  }

  sort(): this {
    if (this.queryStr.sort) {
      const sortBy = (this.queryStr.sort as string).split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate(resultPerPage: number): this {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resultPerPage * (currentPage - 1);
    this.query = this.query.limit(resultPerPage).skip(skip);
    return this;
  }
}

export default ApiFeatures;
