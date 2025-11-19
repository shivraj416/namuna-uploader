export const NAMUNA_MAP = {
    "34": "namuna no 34 takrar aarj",
    "35": "namuna no 35 passbook",
    "36": "namuna no 36 labharthi",
    "37": "namuna no 37 gharbhandhakam",
    "38": "namuna no 38 sammati-pattre",
    "39": "namuna no 39 vikas-kame",
    "40": "namuna no 40 audit report",
    "41": "namuna no 41 vivah-nondh",
    "42": "namuna no 42 masik-sabha",
    "43": "namuna no 43 gram-sabha",
    "44": "namuna no 44 itar",
    "45": "namuna no 5 gramnidhi",
    "46": "namuna no 5 MRE.GS",
    "47": "namuna no 5 15 va aayog",
    "48": "namuna no 5 panipuravatha",
    "49": "namuna no 5 16 va aayog",
    "50": "namuna no 5 dalit-vasti",
    "51": "namuna no 5 itar",
    "52": "namuna no 12 gramnidhi",
    "53": "namuna no 12 MRE.GS",
    "54": "namuna no 12 15 va aayog",
    "55": "namuna no 12 panipuravatha",
    "56": "namuna no 12 16 va aayog",
    "57": "namuna no 12 dalit-vasti",
    "58": "namuna no 12 itar",
};

// Auto-fill missing numbers
for (let i = 1; i <= 100; i++) {
    if (!Object.prototype.hasOwnProperty.call(NAMUNA_MAP, String(i))) {
        NAMUNA_MAP[String(i)] = `namuna no ${i}`;
    }
}
