export type ValidTheme = "PROM" | "usagyuun" | "squid" | "bear" | "powerpuff" | "otonya" | "zookiz";
export interface StyleOptions {
  theme: {
    name: ValidTheme;
    background: string;
  };
  quantity: number;
}
