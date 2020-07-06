var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var dpcdMainSchema = new Schema({
	site: Number,
	dt: Date,
	lx: [Number,Number],
	t: [Number,Number],
	skb: [Number,Number],
	edb: [Number,Number],
	wps: [Number,Number],
	inps: [Number,Number],
	vpr: [Number,Number],
	vbr: [Number,Number],
	vrl: [Number,Number],
	ipr: [Number,Number],
	ibr: [Number,Number],
	irl: [Number,Number],
},
{
    timestamps: true
});
var connection = mongoose.createConnection('mongodb://projek20:projek20@localhost/siagabanjir?replicaSet=rs0',{useNewUrlParser: true,useUnifiedTopology: true});

var Dpcd = connection.model('DpcdMain', dpcdMainSchema,'main_dpcd');

// var lx=[43499.52,38154.24,36495.36,35205.12,33914.88,71516.16,38338.56,34283.52,44789.76,95109.12,32071.68,96583.68,89948.16,32808.96,35020.8,28569.6,31150.08,24698.88,23592.96,24698.88,27463.68,27832.32,36679.68,34467.84,31703.04,34836.48,37785.6,25620.48,27832.32,27463.68,26357.76,26542.08,26542.08,25436.16,23408.64,22026.24,21381.12,20183.04,19353.6,18432,17602.56,16496.64,16220.16,17049.6,17602.56,16680.96,17233.92,19814.4,21657.6,20920.32,38154.24,23592.96,30781.44,27279.36,24883.2,21473.28,19353.6,19077.12,19353.6,19353.6,18892.8,17879.04,17879.04,17786.88,16865.28,16496.64,15943.68,15851.52,15482.88,15206.4,14745.6,15022.08,16035.84,16773.12,17049.6,17418.24,17879.04,16404.48,16865.28,17786.88,17510.4,18247.68,18247.68,18892.8,19998.72,20183.04,20090.88,18708.48,18063.36,17510.4,16404.48,15575.04,15482.88,15298.56,15206.4,15206.4,15206.4,15206.4,14376.96,14008.32,14100.48,14469.12,14653.44,14837.76,15114.24,14376.96,14100.48,13731.84,12994.56,13547.52,13363.2,12072.96,10920.96,10368,10460.16,10229.76,9907.2,11427.84,10874.88,9538.56,8616.96,8570.88,8340.48,8202.24,8064,8156.16,8064,7695.36,7372.8,7326.72,7142.4,6773.76,6220.8,5990.4,5736.96,5414.4,4953.6,4631.04,4377.6,4193.28,4008.96,3893.76,3824.64,4101.12,3479.04,3064.32,2972.16,2845.44,2522.88,2257.92,2039.04,1831.68,1578.24,1370.88,1192.32,1042.56,927.36,777.6,679.68,550.08,446.4,368.64,296.64,231.84,172.8,124.56,91.8,66.24,45.18,31.14,19.62,11.52,6.48,3.56,2.03,1.35,0.9,0.68,0.54,0.41,0.36,0.31,0.31,0.31,0.31,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.27,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.31,0.36,0.36,0.31,0.31,0.31,0.31,0.36,0.36,0.36,0.36,0.36,0.36,0.41,0.36,0.36]
// var t = [31.7,32.3,31.4,31.5,31.5,32.2,32.2,32.1,31.9,31.8,31.7,31.9,32.1,32.3,31.8,31.2,31.2,31.3,31.4,30.8,31,30.8,31,31.1,31.3,30.9,31.1,31.2,31.2,31,31,31.1,30.6,30.7,30.4,30.6,30.1,30.1,30,30.5,30.5,30.5,29.8,29.9,29.6,30.1,30.2,30.4,30.1,30.4,30.4,30.3,30.5,30.7,30.3,30,30.5,30.6,30.2,30.1,30.1,30,30,30,29.8,29.9,30.1,29.9,29.8,30,29.8,29.7,30.2,30.3,29.9,30,30,30,30,29.8,29.7,29.7,29.8,29.9,30,30.1,29.7,29.8,29.7,29.7,29.5,29.3,29.4,29.2,29.2,29.5,29.4,29.6,29.9,29.5,29.5,29.4,29.6,29.7,29.7,29.7,29.7,29.3,29.3,29.1,29.3,29.3,29.2,29,29,29,29,28.9,29,29.2,28.8,28.9,28.9,28.9,28.7,28.6,28.6,28.3,28.5,28.5,28.5,28.6,28.5,28.5,28.4,28.4,28.3,28.3,28.3,28.2,28.1,28.1,28.2,28.1,28.1,28,28,28.1,28,27.9,27.7,27.8,27.7,27.7,27.7,27.7,27.6,27.6,27.6,27.6,27.6,27.6,27.5,27.5,27.5,27.4,27.6,27.6,27.7,27.6,27.5,27.5,27.4,27.4,27.4,27.3,27.3,27.3,27.3,27.3,27.3,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.3,27.2,27.3,27.2,27.2,27.2,27.3,27.3,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.1,27.1,27.1,27.1,27.1,27.1,27.2,27.2,27.2,27.2,27.3,27.3,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.2,27.3,27.3,27.4,27.3,27.3,27.3,27.3,27.3,27.4,27.2,27.2,27,26.9,26.9,27,27,27,26.9,26.8,26.8,26.8,26.8,26.8,26.9,26.9,27,27,27,26.9,26.9,27,27,27.1,27.1,27,26.9,27,27]
// var edbMah = [4182.16,3726.31,3650.15,3624.48,3548.94,5596.37,3701.32,3500.26,4283.9,6887.62,3524.71,6868.8,6850.99,3879.31,3775.89,3299.74,3423.61,3053.22,2908.25,2956.07,3078.04,3102.04,3623.55,3424.11,3275,3473.93,3700.44,2956.55,3029.7,3029.35,2956.43,2956.43,2931.3,2931.06,2834.11,2738.93,2714.93,2643.99,2597.41,2505.08,2481.58,2390.27,2366.84,2367.24,2412.36,2344.61,2344.5,2458.95,2574.22,2551.23,3725.12,2645.56,3053.52,2859.85,2764.04,2574.8,2435.82,2390.1,2390.1,2389.88,2366.9,2321.33,2298.91,2298.96,2231.25,2187.25,2165.23,2121.31,2120.66,2077.62,2055.95,2055.53,2077.84,2121.42,2121.42,2143.34,2143.4,2056.33,2077.73,2121.15,2099.05,2164.68,2121.1,2164.85,2209.46,2187.36,2209.24,2142.85,2098.84,2055.42,1990.67,1927.04,1905.88,1905.62,1884.77,1884.82,1843.59,1864.32,1802.23,1781.69,1761.29,1801.57,1781.59,1802.12,1802.28,1741.1,1721.16,1720.37,1660.25,1700.12,1680.14,1620.64,1543.09,1504.54,1448.3,1485.67,1467.05,1504.91,1448.4,1429.81,1374.62,1356.46,1320.58,1320.37,1301.91,1302.04,1284.45,1266.82,1266.82,1215.13,1232.22,1198.37,1164.74,1147.99,1131.42,1098.91,1082.54,1050.84,1019.64,1004.11,973.57,900.05,776.92,803.04,776.73,750.79,763.38,750.73,725.77,725.67,713.29,701.35,689.49,677.87,666.01,632.16,599.81,599.68,589.25,589.33,549.19,469.09,539.3,568.71,569.04,579.13,599.92,579.36,559.45,579.18,569.08,569.01,559.16,568.96,568.76,549.11,558.69,549.19,539.58,539.54,530.16,530,530.04,530.02,530,520.84,520.75,502.96,494.27,502.99,494.33,485.88,485.75,477.38,477.5,469.37,461.41,461.35,438.38,453.37,453.32,445.83,445.87,445.77,438.4,445.74,431.18,423.99,423.97,424.05,424.02,417.14,417.15,410.47,404.08,397.84,404.08,397.8,391.7,391.59,385.69,391.57,379.99,374.59,374.5,374.54,374.46,369.19,369.18,359.12,354.41,359.09,349.93,349.89,345.55,341.41,337.52,303.84,313.58,330.24,330.24,330.27,330.24,326.98,330.22,326.95,313.6,320.99,320.99,313.58,311.55,304.56,303.01,304.57,306.75,308.67,315.84,315.83,315.83,313.57,311.57,311.55,311.52,309.71,308.11,306.71,305.54,305.53]
// var skb = [56,50,49,49,48,76,50,47,58,93,48,93,92,52,51,45,46,41,39,40,42,42,49,46,44,47,50,40,41,41,40,40,40,40,38,37,37,36,35,34,33,32,32,32,33,32,32,33,35,34,50,36,41,39,37,35,33,32,32,32,32,31,31,31,30,30,29,29,29,28,28,28,28,29,29,29,29,28,28,29,28,29,29,29,30,30,30,29,28,28,27,26,26,26,25,25,25,25,24,24,24,24,24,24,24,23,23,23,22,23,23,22,21,20,20,20,20,20,20,19,19,18,18,18,18,18,17,17,17,16,17,16,16,15,15,15,15,14,14,14,13,12,10,11,10,10,10,10,10,10,10,9,9,9,9,9,8,8,8,8,7,6,7,8,8,8,8,8,8,8,8,8,8,8,8,7,8,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,7,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4,4]
// var edb = [10.38,9.44,9.3,9.26,9.12,13.11,9.38,8.95,10.57,15.18,9.02,15.15,15.05,9.7,9.58,8.56,8.85,8.02,7.68,7.79,8.07,8.14,9.3,8.83,8.5,8.95,9.41,7.78,7.93,7.95,7.79,7.79,7.76,7.77,7.57,7.35,7.3,7.13,7.02,6.77,6.73,6.5,6.46,6.45,6.57,6.4,6.39,6.67,6.95,6.89,9.48,7.09,8.02,7.58,7.36,6.93,6.61,6.49,6.51,6.51,6.46,6.36,6.29,6.3,6.13,6.03,5.97,5.86,5.87,5.75,5.71,5.71,5.75,5.86,5.87,5.92,5.92,5.69,5.75,5.87,5.82,5.99,5.87,5.98,6.08,6.02,6.08,5.93,5.82,5.72,5.56,5.4,5.35,5.36,5.3,5.3,5.18,5.24,5.07,5.03,4.98,5.1,5.03,5.08,5.08,4.92,4.87,4.88,4.73,4.84,4.79,4.63,4.44,4.34,4.19,4.29,4.24,4.34,4.19,4.14,4,3.95,3.85,3.85,3.82,3.81,3.77,3.72,3.73,3.59,3.64,3.54,3.44,3.4,3.36,3.27,3.23,3.14,3.05,3.01,2.93,2.73,2.38,2.45,2.38,2.31,2.36,2.32,2.24,2.25,2.21,2.17,2.14,2.1,2.07,1.97,1.88,1.88,1.85,1.85,1.73,1.5,1.71,1.79,1.79,1.82,1.87,1.81,1.75,1.82,1.78,1.79,1.76,1.79,1.79,1.73,1.76,1.73,1.7,1.7,1.68,1.68,1.67,1.68,1.68,1.65,1.65,1.59,1.57,1.59,1.57,1.54,1.54,1.52,1.52,1.49,1.47,1.47,1.4,1.45,1.45,1.42,1.42,1.42,1.4,1.43,1.38,1.36,1.36,1.36,1.36,1.34,1.34,1.32,1.3,1.28,1.3,1.28,1.26,1.26,1.25,1.26,1.23,1.21,1.21,1.21,1.21,1.2,1.2,1.17,1.15,1.17,1.14,1.14,1.13,1.11,1.1,1.02,1.04,1.09,1.09,1.08,1.08,1.07,1.08,1.08,1.04,1.06,1.06,1.04,1.03,1.02,1.01,1.02,1.02,1.05,1.05,1.04,1.05,1.04,1.03,1.03,1.03,1.03,1.03,1.02,1.02,1.02]
// var wps = [4.598,4.034,3.894,3.803,3.714,7.422,4.085,3.674,4.69,9.927,3.366,9.76,9.537,3.498,3.676,3.009,3.361,2.713,2.573,2.661,2.926,2.963,3.942,3.621,3.38,3.712,4.048,2.785,2.973,2.936,2.822,2.834,2.87,2.755,2.541,2.378,2.315,2.189,2.089,1.989,1.901,1.751,1.701,1.763,1.838,1.75,1.788,2.011,2.223,2.186,4.086,2.436,3.203,2.863,2.674,2.286,2.035,1.985,2.022,2.034,2.01,1.885,1.872,1.86,1.76,1.71,1.635,1.61,1.561,1.536,1.473,1.498,1.609,1.683,1.708,1.745,1.807,1.658,1.695,1.782,1.769,1.855,1.831,1.905,2.029,2.029,2.054,1.904,1.817,1.755,1.631,1.532,1.52,1.495,1.482,1.469,1.469,1.481,1.407,1.358,1.345,1.382,1.406,1.431,1.467,1.381,1.344,1.307,1.221,1.27,1.27,1.122,0.999,0.938,0.937,0.925,0.889,1.072,1.034,0.864,0.742,0.729,0.693,0.668,0.643,0.644,0.643,0.607,0.583,0.569,0.546,0.509,0.449,0.424,0.388,0.339,0.29,0.254,0.23,0.206,0.181,0.169,0.157,0.206,0.145,0.085,0.072,0.072,0.024,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
// var inps = [1.059,1.059,1.069,1.082,1.097,1.039,1.067,1.074,1.049,1.045,1.052,1.011,1.061,1.068,1.052,1.056,1.081,1.101,1.094,1.08,1.068,1.067,1.077,1.053,1.068,1.068,1.073,1.09,1.071,1.072,1.073,1.07,1.084,1.086,1.089,1.083,1.086,1.088,1.083,1.083,1.084,1.066,1.053,1.038,1.048,1.053,1.041,1.019,1.03,1.048,1.073,1.035,1.043,1.052,1.078,1.068,1.055,1.044,1.049,1.055,1.068,1.059,1.051,1.049,1.048,1.041,1.03,1.02,1.012,1.014,1.004,1.002,1.008,1.008,1.006,1.006,1.014,1.015,1.009,1.005,1.014,1.021,1.007,1.012,1.018,1.008,1.026,1.022,1.01,1.006,0.998,0.988,0.986,0.981,0.979,0.97,0.97,0.978,0.983,0.974,0.959,0.96,0.964,0.969,0.975,0.965,0.958,0.957,0.945,0.942,0.955,0.935,0.921,0.911,0.902,0.911,0.903,0.944,0.957,0.912,0.867,0.858,0.837,0.821,0.805,0.796,0.805,0.796,0.798,0.784,0.772,0.759,0.729,0.716,0.684,0.634,0.595,0.557,0.533,0.498,0.46,0.442,0.418,0.51,0.425,0.282,0.249,0.261,0.098,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
// var vpr =[12.596,12.527,12.52,12.509,12.505,12.752,12.531,12.498,12.608,12.943,12.512,12.944,12.958,12.584,12.546,12.486,12.495,12.443,12.428,12.435,12.45,12.449,12.515,12.486,12.471,12.497,12.534,12.431,12.441,12.442,12.43,12.43,12.426,12.411,12.396,12.388,12.381,12.37,12.362,12.351,12.347,12.332,12.329,12.328,12.336,12.324,12.328,12.339,12.349,12.35,12.573,12.364,12.416,12.394,12.379,12.357,12.334,12.331,12.33,12.33,12.33,12.323,12.319,12.315,12.308,12.3,12.296,12.293,12.289,12.285,12.277,12.281,12.281,12.288,12.288,12.292,12.291,12.28,12.28,12.287,12.288,12.287,12.287,12.291,12.298,12.294,12.298,12.287,12.279,12.271,12.264,12.257,12.257,12.253,12.249,12.241,12.241,12.241,12.233,12.23,12.229,12.229,12.229,12.229,12.229,12.221,12.221,12.218,12.21,12.21,12.21,12.199,12.187,12.184,12.171,12.176,12.176,12.183,12.167,12.168,12.156,12.157,12.153,12.145,12.141,12.145,12.141,12.137,12.137,12.113,12.129,12.126,12.122,12.118,12.114,12.106,12.103,12.095,12.091,12.091,12.083,12.087,12.091,12.09,12.083,12.075,12.071,12.071,12.067,12.063,12.06,12.056,12.052,12.044,12.044,12.036,12.036,12.032,12.024,12.028,12.028,11.856,10.786,9.58,8.001,6.3,5.06,4.092,3.519,2.859,1.994,1.426,1.201,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
// var vbr =[12.752,12.64,12.615,12.602,12.586,13.174,12.644,12.577,12.773,13.598,12.567,13.589,13.567,12.636,12.629,12.508,12.551,12.446,12.417,12.43,12.464,12.472,12.615,12.565,12.527,12.582,12.64,12.438,12.468,12.46,12.443,12.443,12.536,12.511,12.469,12.444,12.431,12.406,12.386,12.365,12.344,12.315,12.307,12.315,12.328,12.311,12.311,12.353,12.391,12.382,12.689,12.384,12.514,12.447,12.418,12.355,12.313,12.301,12.305,12.309,12.301,12.284,12.276,12.271,12.255,12.242,12.23,12.226,12.217,12.209,12.201,12.201,12.214,12.222,12.23,12.235,12.243,12.218,12.222,12.235,12.231,12.247,12.239,12.248,12.269,12.269,12.273,12.24,12.231,12.219,12.198,12.181,12.173,12.169,12.164,12.16,12.16,12.16,12.148,12.135,12.135,12.14,12.14,12.144,12.144,12.132,12.123,12.115,12.102,12.107,12.107,12.082,12.065,12.044,12.036,12.044,12.032,12.061,12.041,12.028,12.003,11.998,11.99,11.986,11.982,11.982,11.978,11.974,11.965,11.953,11.953,11.945,11.924,11.92,11.92,11.907,11.899,11.887,11.878,11.87,11.862,11.838,11.801,11.814,11.797,11.785,11.789,11.785,11.776,11.768,11.768,11.76,11.751,11.751,11.743,11.727,11.723,11.715,11.706,11.706,11.69,11.65,11.682,11.694,11.702,11.698,11.71,11.702,11.702,11.702,11.698,11.698,11.694,11.694,11.694,11.694,11.694,11.69,11.686,11.686,11.682,11.686,11.678,11.678,11.674,11.67,11.674,11.67,11.666,11.666,11.666,11.662,11.658,11.654,11.65,11.65,11.646,11.646,11.63,11.646,11.642,11.638,11.638,11.634,11.634,11.625,11.63,11.621,11.625,11.625,11.626,11.617,11.617,11.613,11.613,11.609,11.609,11.609,11.605,11.605,11.593,11.601,11.597,11.593,11.589,11.589,11.593,11.585,11.589,11.581,11.573,11.577,11.573,11.573,11.565,11.565,11.557,11.489,11.525,11.545,11.541,11.549,11.545,11.545,11.545,11.545,11.525,11.533,11.537,11.517,11.525,11.497,11.485,11.493,11.517,11.448,11.529,11.517,11.525,11.525,11.517,11.517,11.513,11.513,11.509,11.509,11.505,11.497]
// var vrl=[12.276,12.201,12.189,12.184,12.172,12.513,12.197,12.164,12.293,12.762,12.168,12.758,12.754,12.226,12.209,12.13,12.151,12.088,12.064,12.072,12.093,12.097,12.184,12.151,12.126,12.159,12.197,12.072,12.084,12.084,12.072,12.072,12.068,12.068,12.051,12.034,12.03,12.017,12.009,11.993,11.988,11.972,11.968,11.968,11.976,11.964,11.964,11.984,12.005,12.001,12.201,12.018,12.089,12.055,12.039,12.005,11.98,11.972,11.972,11.972,11.968,11.959,11.955,11.955,11.943,11.934,11.93,11.922,11.922,11.914,11.909,11.909,11.914,11.922,11.922,11.926,11.926,11.909,11.914,11.922,11.918,11.93,11.922,11.93,11.938,11.934,11.938,11.926,11.918,11.909,11.897,11.884,11.88,11.88,11.876,11.876,11.868,11.872,11.859,11.855,11.851,11.859,11.855,11.859,11.859,11.847,11.843,11.843,11.83,11.838,11.834,11.822,11.805,11.797,11.784,11.793,11.788,11.797,11.784,11.78,11.768,11.763,11.755,11.755,11.751,11.751,11.747,11.742,11.742,11.73,11.734,11.726,11.718,11.713,11.709,11.701,11.697,11.688,11.68,11.676,11.667,11.647,11.609,11.617,11.609,11.601,11.605,11.601,11.592,11.592,11.588,11.584,11.58,11.576,11.572,11.559,11.547,11.547,11.542,11.542,11.526,11.488,11.521,11.534,11.534,11.538,11.547,11.538,11.53,11.538,11.534,11.534,11.53,11.534,11.534,11.526,11.53,11.526,11.522,11.522,11.517,11.517,11.517,11.517,11.517,11.513,11.513,11.505,11.501,11.505,11.501,11.497,11.497,11.492,11.493,11.488,11.484,11.484,11.472,11.48,11.48,11.476,11.476,11.476,11.472,11.476,11.468,11.463,11.463,11.463,11.463,11.459,11.459,11.455,11.451,11.447,11.451,11.447,11.443,11.442,11.438,11.442,11.434,11.43,11.43,11.43,11.43,11.426,11.426,11.418,11.413,11.418,11.409,11.409,11.405,11.401,11.397,11.334,11.363,11.388,11.388,11.388,11.388,11.384,11.388,11.384,11.363,11.376,11.376,11.363,11.359,11.338,11.326,11.338,11.347,11.292,11.368,11.367,11.367,11.363,11.359,11.359,11.359,11.355,11.351,11.347,11.342,11.342]
// var ibr=[0.365,0.322,0.311,0.304,0.297,0.582,0.326,0.294,0.372,0.767,0.269,0.754,0.736,0.278,0.293,0.241,0.269,0.218,0.207,0.214,0.235,0.238,0.315,0.29,0.271,0.297,0.323,0.224,0.239,0.236,0.227,0.228,0.231,0.222,0.205,0.192,0.187,0.177,0.169,0.161,0.154,0.142,0.138,0.143,0.149,0.142,0.145,0.163,0.18,0.177,0.325,0.197,0.258,0.231,0.216,0.185,0.165,0.161,0.164,0.165,0.163,0.153,0.152,0.151,0.143,0.139,0.133,0.131,0.127,0.125,0.12,0.122,0.131,0.137,0.139,0.142,0.147,0.135,0.138,0.145,0.144,0.151,0.149,0.155,0.165,0.165,0.167,0.155,0.148,0.143,0.133,0.125,0.124,0.122,0.121,0.12,0.12,0.121,0.115,0.111,0.11,0.113,0.115,0.117,0.12,0.113,0.11,0.107,0.1,0.104,0.104,0.092,0.082,0.077,0.077,0.076,0.073,0.088,0.085,0.071,0.061,0.06,0.057,0.055,0.053,0.053,0.053,0.05,0.048,0.047,0.045,0.042,0.037,0.035,0.032,0.028,0.024,0.021,0.019,0.017,0.015,0.014,0.013,0.017,0.012,0.007,0.006,0.006,0.002,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
// var irl=[0.088,0.122,0.13,0.135,0.141,0,0.119,0.146,0.086,0,0.169,0,0,0.171,0.15,0.191,0.163,0.209,0.214,0.207,0.19,0.187,0.119,0.147,0.162,0.139,0.111,0.199,0.186,0.188,0.195,0.194,0.19,0.198,0.211,0.22,0.227,0.233,0.239,0.246,0.252,0.261,0.263,0.259,0.254,0.26,0.258,0.243,0.229,0.232,0.047,0.218,0.169,0.194,0.201,0.225,0.241,0.244,0.244,0.24,0.241,0.248,0.249,0.25,0.255,0.259,0.263,0.264,0.267,0.27,0.272,0.271,0.264,0.26,0.257,0.255,0.252,0.26,0.258,0.251,0.251,0.246,0.248,0.243,0.235,0.235,0.238,0.243,0.248,0.251,0.258,0.268,0.264,0.265,0.267,0.268,0.267,0.267,0.271,0.274,0.275,0.271,0.27,0.269,0.266,0.272,0.274,0.276,0.28,0.277,0.276,0.285,0.294,0.296,0.295,0.297,0.298,0.289,0.287,0.3,0.307,0.307,0.31,0.311,0.311,0.31,0.31,0.312,0.314,0.312,0.316,0.318,0.321,0.323,0.325,0.327,0.332,0.331,0.333,0.333,0.334,0.333,0.329,0.326,0.33,0.332,0.333,0.335,0.335,0.34,0.339,0.341,0.343,0.344,0.345,0.345,0.345,0.346,0.347,0.348,0.347,0.342,0.346,0.348,0.349,0.348,0.349,0.349,0.35,0.349,0.349,0.348,0.348,0.348,0.347,0.347,0.347,0.347,0.346,0.346,0.346,0.345,0.345,0.345,0.345,0.345,0.345,0.345,0.345,0.343,0.345,0.344,0.344,0.345,0.344,0.344,0.345,0.343,0.343,0.342,0.342,0.342,0.342,0.342,0.342,0.341,0.346,0.34,0.34,0.34,0.341,0.34,0.341,0.34,0.34,0.34,0.34,0.34,0.339,0.338,0.338,0.339,0.338,0.338,0.338,0.337,0.337,0.338,0.337,0.336,0.336,0.336,0.336,0.336,0.335,0.335,0.334,0.326,0.332,0.333,0.333,0.333,0.333,0.333,0.333,0.333,0.33,0.332,0.332,0.33,0.33,0.327,0.326,0.327,0.329,0.323,0.331,0.33,0.331,0.33,0.33,0.33,0.33,0.329,0.329,0.328,0.328,0.328]
// var ipr=[0.403,0.395,0.392,0.391,0.389,0.427,0.395,0.391,0.405,0.454,0.391,0.453,0.455,0.4,0.394,0.386,0.387,0.38,0.379,0.379,0.381,0.381,0.39,0.388,0.385,0.388,0.393,0.38,0.382,0.381,0.379,0.38,0.378,0.377,0.374,0.373,0.372,0.371,0.37,0.37,0.369,0.368,0.366,0.367,0.367,0.367,0.367,0.369,0.37,0.37,0.393,0.373,0.381,0.377,0.375,0.371,0.368,0.368,0.367,0.367,0.367,0.365,0.365,0.365,0.364,0.363,0.362,0.362,0.361,0.361,0.36,0.36,0.361,0.362,0.362,0.362,0.362,0.361,0.361,0.362,0.361,0.362,0.362,0.362,0.363,0.363,0.363,0.362,0.36,0.359,0.358,0.357,0.356,0.356,0.356,0.356,0.356,0.356,0.355,0.354,0.354,0.353,0.354,0.354,0.355,0.354,0.353,0.352,0.351,0.351,0.351,0.35,0.348,0.347,0.346,0.346,0.346,0.347,0.346,0.345,0.344,0.344,0.343,0.343,0.341,0.341,0.341,0.34,0.34,0.338,0.339,0.339,0.338,0.338,0.337,0.336,0.335,0.335,0.334,0.333,0.332,0.33,0.326,0.327,0.326,0.324,0.324,0.324,0.324,0.323,0.323,0.323,0.323,0.322,0.321,0.321,0.32,0.319,0.319,0.319,0.317,0.314,0.316,0.318,0.319,0.319,0.32,0.32,0.32,0.319,0.319,0.319,0.318,0.318,0.318,0.317,0.317,0.317,0.317,0.317,0.316,0.316,0.316,0.316,0.316,0.316,0.315,0.316,0.315,0.316,0.316,0.315,0.315,0.315,0.315,0.315,0.314,0.314,0.312,0.313,0.313,0.313,0.313,0.313,0.312,0.313,0.313,0.312,0.311,0.312,0.311,0.311,0.311,0.311,0.311,0.311,0.31,0.311,0.31,0.31,0.309,0.31,0.309,0.309,0.309,0.309,0.309,0.309,0.309,0.308,0.308,0.308,0.308,0.307,0.307,0.306,0.306,0.299,0.303,0.304,0.304,0.305,0.304,0.304,0.304,0.304,0.302,0.304,0.303,0.302,0.302,0.299,0.299,0.299,0.301,0.295,0.302,0.303,0.302,0.302,0.302,0.302,0.302,0.301,0.3,0.3,0.3,0.3]




		i=0;
Dpcd.find({'dt':{$gte: new Date('2020-07-05T12:00:00'),$lte: new Date('2020-07-05T21:00:00')}}).lean().sort({'dt':-1}).exec((err,resp)=>{
	 
	resp.forEach(data=>{
		lxq=lx[i]
		tq=t[i]
		skbq=skb[i]
		edbq=edb[i]
		wpsq=wps[i]
		inpsq=inps[i]
		vprq=vpr[i]
		vbrq=vbr[i]
		vrlq=vrl[i]
		ibrq=ibr[i]
		irlq=irl[i]
		iprq=ipr[i]
		Dpcd.updateMany({'_id':data._id},{
			"lx.0":lx,
			"t.0":t,
			"skb.0":skbq,
			"edb.0":edbq,
			"wps.0":wpsq,
			"inps.0":inpsq,
			"vpr.0":vprq,
			"vbr.0":vbrq,
			"vrl.0":vrlq,
			"ipr.0":iprq,
			"ibr.0":ibrq,
			"irl.0":irlq,

		},(err,res)=>{
			console.log(err,resp)
		})
		i+=1	
	})

})