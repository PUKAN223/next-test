import Stocks from "./Stocks";

export default interface Employees {
    username: string,
    password: string,
    profile: {
        name: string,
        age: number,
        gender: string,
        image: string
    }
  };