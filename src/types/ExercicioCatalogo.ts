export interface ExercicioCatalogo {
  id?:             number | null;
  name:            string;
  desc:            string;
  musculoPrimario: string;
  musculosSecund:  string[];
  equipamento:     string;
  tag:             string;
  createdAt?:      string;
}