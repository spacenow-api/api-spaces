//@Table({
//  tableName: "ListSettings"
//})
export class ListSettings extends Model {
  id!;

  typeId!;

  itemName;

  otherItemName;

  description;

  maximum;

  minimum;

  startValue;

  endValue;

  step;

  isEnable;

  photo;

  photoType;

  isSpecification!;

  createdAt!;

  updatedAt!;

  specData;

  subCategories!;
}
