interface ICategory {
  id: string;
  name: string;
  slug: string;
  parentId: string;
  order: number;
  isActive: boolean;
}

export default ICategory;
