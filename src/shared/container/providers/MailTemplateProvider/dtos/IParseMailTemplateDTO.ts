interface ITemplateVariables {
  [key: string]: string | number;
} // esse key serve para determinar o nome independente do que seja, name, age etc

export default interface IParseMailTemplateDTO {
  file: string;
  variables: ITemplateVariables;
}
