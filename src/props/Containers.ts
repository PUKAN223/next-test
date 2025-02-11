import Stocks from "./Stocks";

export default interface Container {
    name: string;
    category: string;
    description: string;
    logo: string;
    id?: string;
    stock: Stocks[]
    createBy: string;
  };