import numpy as np
import matplotlib.pyplot as plt

#different temeperature lapse rate at each point in atmosphere
lapse_rate_def = {0: -6.5, 
                  11.0: 0.0, 
                  20.0: 1.0, 
                  32.0: 2.8, 
                  47.0: 0.0, 
                  51.0: -2.8, 
                  71.0: -2.0}


def get_values(g=9.81):
    T0 = 273 + 15
    R0 = 1.225
    M = 0.02896
    R = 8.314

    lapse_rate_keys = {k * 1000: v/1000 for k, v in lapse_rate_def.items()}
    altitudes = np.linspace(0, 80000, 50)


    def lapse_rate(h):
        keys = np.array(list(lapse_rate_keys.keys()))
        index = np.searchsorted(keys, h, side="right") - 1
        return list(lapse_rate_keys.values())[index]

    def air_density(alti):
        #faster way of utilizing lapse rate by vectorizing it (chat gpt told me)
        L = np.vectorize(lapse_rate)(alti)
        #goofy equation to work out changing density after some rearraging and integrating of 
        term1 = (M * g) / (L * R)
        term2 = 1 - ((L * alti) / T0)
        rho_term = np.where(L != 0, R0 * (term2 ** term1), R0 * np.exp(-(M * g * alti) / (R * T0)))
        return rho_term

    rho = air_density(altitudes)
    return altitudes, rho