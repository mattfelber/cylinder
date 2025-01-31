import React, { useState } from 'react';
import { 
  Container, Typography, Box, TextField, MenuItem, Button, Paper, Grid,
  Chip, Stack, InputAdornment
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import TungstenIcon from '@mui/icons-material/Tungsten';
import CalculateIcon from '@mui/icons-material/Calculate';
import ScienceIcon from '@mui/icons-material/Science';

interface CylinderData {
  gasType: string;
  displayName: string;
  components: string[];
  bumpTimeMin: number;
  calTimeMin: number;
  flowRate: number;
}

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#90caf9',
    },
    secondary: {
      main: '#f48fb1',
    },
    background: {
      default: '#121212',
      paper: '#1e1e1e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 500,
    },
    h5: {
      fontWeight: 400,
    },
  },
  components: {
    MuiTextField: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: '#90caf9',
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontSize: '1.1rem',
          padding: '12px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
});

const formatGasType = (gasType: string): { displayName: string; components: string[] } => {
  if (gasType.includes(" in 1")) {
    const [count, rest] = gasType.split(" in 1 ");
    const components = rest.replace(/[()]/g, '').split(',').map(s => s.trim());
    return {
      displayName: `${count}-in-1 Gas Mixture`,
      components
    };
  }
  const match = gasType.match(/(.*?)\s*\((.*?)\)/);
  if (match) {
    return {
      displayName: match[1].trim(),
      components: [match[2].trim()]
    };
  }
  return {
    displayName: gasType,
    components: [gasType]
  };
};

const cylinderData: CylinderData[] = [
  { gasType: "3 in 1 (O2,LEL,CO)", ...formatGasType("3 in 1 (O2,LEL,CO)"), bumpTimeMin: 0.5, calTimeMin: 2, flowRate: 0.5 },
  { gasType: "3 in 1 (O2,LEL,H2S)", ...formatGasType("3 in 1 (O2,LEL,H2S)"), bumpTimeMin: 0.5, calTimeMin: 2, flowRate: 0.5 },
  { gasType: "4 in 1 (O2,LEL,CO,H2S)", ...formatGasType("4 in 1 (O2,LEL,CO,H2S)"), bumpTimeMin: 0.4, calTimeMin: 1.5, flowRate: 0.5 },
  { gasType: "4 in 1 (O2,LEL,CO,CO2)", ...formatGasType("4 in 1 (O2,LEL,CO,CO2)"), bumpTimeMin: 0.5, calTimeMin: 2.15, flowRate: 0.5 },
  { gasType: "5 in 1 (O2,LEL,CO,H2S,CO2)", ...formatGasType("5 in 1 (O2,LEL,CO,H2S,CO2)"), bumpTimeMin: 0.5, calTimeMin: 2.15, flowRate: 0.5 },
  { gasType: "5 in 1 (O2,LEL,CO,H2S,SO2)", ...formatGasType("5 in 1 (O2,LEL,CO,H2S,SO2)"), bumpTimeMin: 0.75, calTimeMin: 2.5, flowRate: 0.5 },
  { gasType: "Ammonia (NH3)", ...formatGasType("Ammonia (NH3)"), bumpTimeMin: 1, calTimeMin: 3, flowRate: 0.5 },
  { gasType: "Carbon Dioxide (CO2)", ...formatGasType("Carbon Dioxide (CO2)"), bumpTimeMin: 0.5, calTimeMin: 1.5, flowRate: 0.5 },
  { gasType: "Carbon Monoxide (CO)", ...formatGasType("Carbon Monoxide (CO)"), bumpTimeMin: 0.4, calTimeMin: 1.5, flowRate: 0.5 },
  { gasType: "Chlorine (Cl2)", ...formatGasType("Chlorine (Cl2)"), bumpTimeMin: 3, calTimeMin: 6, flowRate: 0.5 },
];

function App() {
  const [selectedGas, setSelectedGas] = useState('');
  const [testsPerMonth, setTestsPerMonth] = useState('');
  const [calibrationsPerMonth, setCalibrationsPerMonth] = useState('');
  const [instruments, setInstruments] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const calculateUsage = () => {
    setError('');
    
    if (!selectedGas || !testsPerMonth || !calibrationsPerMonth || !instruments) {
      setError('Please fill in all fields');
      return;
    }

    const cylinder = cylinderData.find(c => c.gasType === selectedGas);
    if (!cylinder) {
      setError('Invalid gas type selected');
      return;
    }

    const tests = parseInt(testsPerMonth);
    const calibrations = parseInt(calibrationsPerMonth);
    const instrumentCount = parseInt(instruments);

    if (isNaN(tests) || isNaN(calibrations) || isNaN(instrumentCount)) {
      setError('Please enter valid numbers');
      return;
    }

    const totalUsage = (
      ((cylinder.bumpTimeMin * tests * cylinder.flowRate) +
      (cylinder.calTimeMin * calibrations * cylinder.flowRate)) *
      instrumentCount
    );

    setResult(parseFloat(totalUsage.toFixed(2)));
  };

  const selectedCylinder = cylinderData.find(c => c.gasType === selectedGas);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Box sx={{ my: 4 }}>
          <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
            <TungstenIcon sx={{ fontSize: 40 }} />
            Gas Usage Calculator
          </Typography>
          
          <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Select Gas Type"
                  value={selectedGas}
                  onChange={(e) => setSelectedGas(e.target.value)}
                  sx={{ '& .MuiSelect-select': { py: 1.5 } }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <ScienceIcon />
                      </InputAdornment>
                    ),
                  }}
                >
                  {cylinderData.map((option) => (
                    <MenuItem key={option.gasType} value={option.gasType} sx={{ py: 1.5 }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ mb: 0.5 }}>
                          {option.displayName}
                        </Typography>
                        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                          {option.components.map((component, index) => (
                            <Chip
                              key={index}
                              label={component}
                              size="small"
                              sx={{ 
                                backgroundColor: 'rgba(144, 202, 249, 0.1)',
                                borderRadius: '4px',
                              }}
                            />
                          ))}
                        </Stack>
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Tests per Month"
                  type="number"
                  value={testsPerMonth}
                  onChange={(e) => setTestsPerMonth(e.target.value)}
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Calibrations per Month"
                  type="number"
                  value={calibrationsPerMonth}
                  onChange={(e) => setCalibrationsPerMonth(e.target.value)}
                  InputProps={{
                    inputProps: { min: 0 }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Number of Instruments"
                  type="number"
                  value={instruments}
                  onChange={(e) => setInstruments(e.target.value)}
                  InputProps={{
                    inputProps: { min: 1 }
                  }}
                />
              </Grid>

              {selectedCylinder && (
                <Grid item xs={12}>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: 'background.paper' }}>
                    <Typography variant="body2" color="text.secondary">
                      Selected Gas Properties:
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Typography variant="body2">
                        Bump Test Time: {selectedCylinder.bumpTimeMin} min | 
                        Calibration Time: {selectedCylinder.calTimeMin} min | 
                        Flow Rate: {selectedCylinder.flowRate} LPM
                      </Typography>
                    </Box>
                  </Paper>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={calculateUsage}
                  startIcon={<CalculateIcon />}
                  sx={{ 
                    mt: 2,
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
                  }}
                >
                  Calculate Usage
                </Button>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Typography color="error" align="center" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                </Grid>
              )}

              {result !== null && (
                <Grid item xs={12}>
                  <Paper 
                    elevation={2} 
                    sx={{ 
                      p: 3, 
                      mt: 2, 
                      bgcolor: 'background.paper',
                      border: '1px solid rgba(144, 202, 249, 0.2)',
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h5" align="center" gutterBottom>
                      Estimated Gas Usage
                    </Typography>
                    <Typography 
                      variant="h4" 
                      align="center" 
                      color="primary"
                      sx={{ 
                        fontWeight: 'bold',
                        background: 'linear-gradient(45deg, #90CAF9 30%, #64B5F6 90%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                      }}
                    >
                      {result} Liters
                    </Typography>
                  </Paper>
                </Grid>
              )}
            </Grid>
          </Paper>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default App;
