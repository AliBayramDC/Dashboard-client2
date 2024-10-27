import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const StatBox = ({ title, subtitle, icon, progress, increase }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="19.9px 38.5px">
      <Box display="flex" justifyContent="center">
        <Box>
          <Typography
            variant="h2"
            fontWeight="bold"
            sx={{ color: "#003A7D" }}
          >
            {title}
          </Typography>
        </Box>
        {/* <Box>
          <Typography>{icon}</Typography>
        </Box> */}
      </Box>
      <Box display="flex" justifyContent="center" mt="2px">
        <Typography variant="h5" sx={{ color: "#002055", fontWeight: "medium" }}>
          {subtitle}
        </Typography>
        {/* <Typography
          variant="body2"
          fontStyle="italic"
          sx={{ color: colors.greenAccent[600] }}
        >
          {icon}
        </Typography> */}
      </Box>
    </Box>
  );
};

export default StatBox;
