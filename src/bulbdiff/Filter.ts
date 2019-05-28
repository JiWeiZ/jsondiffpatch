import Context from "./Context";

export interface Filter {
  (context: Context): void
}
