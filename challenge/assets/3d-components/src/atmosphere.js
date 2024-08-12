

export class Atmosphere{
    constructor(){
        this.lapse_rate_keys = Object.keys(LAPSE_RATE);
        this.lapse_rate_val = Object.values(LAPSE_RATE);


    }

    get_lapse_rate(h){
        for (let i = 0; i < this.lapse_rate_keys.length; ++i){

            if (h < this.lapse_rate_keys[i]){
                return this.lapse_rate_val[i-1];
            }

        }
        return null;
    }

    checkPower(x, y) {
        if (x > 0 || Math.round(y) == y) {
          return Math.pow(x, y)
        } else {
          var r = -1 * Math.pow(-x, y);
          if( Math.pow( r, 1/y) == x) 
            return r;
          else 
            return NaN;
        }
      }

    return_density(h){
        let L = this.get_lapse_rate(h);
        L /= 1000;
        let alt = h * 1000

        let term1 = (M * G) / (L * R);
        let term2 = 1 - ((L * alt) / T0);
        
        let rho = (L != 0) ? R0 * (term2 ** term1) : R0 * Math.exp(-(M * G * alt) / (R * T0))

        return rho;

    }

    return_basic_density(h, planet_name){
      if (planet_name == 'moon' || planet_name == 'mercury'){
        return 0;
      }
      let mu = planetary_data[planet_name].mu
      let Rspecific = R / (mu * HYDROGEN_ATOM_WEIGHT);
      let P0 = planetary_data[planet_name].P0 * 100000;
      let T0 = planetary_data[planet_name].T;

      let rho0 = P0 / (Rspecific * T0);
      let H = planetary_data[planet_name].H;
      let rho = rho0 * Math.exp(-h / H);
      console.log(rho);
      return rho;
    }
}