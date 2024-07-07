import React from 'react';
import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";
import ProgressCircle from "./ProgressCircle";

const DetailsBox = ({ title, subtitle, icon, progress, increase, word, definition, partOfSpeech, example }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <Box width="100%" m="0 30px">
      <Box display="flex" justifyContent="space-between">
        <Box>
          {icon}
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ color: colors.grey[100] }}
          >
            {title}
          </Typography>
          {subtitle && (
            <Typography
              variant="h6"
              sx={{ color: colors.grey[200] }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
        {progress !== undefined && (
          <Box display="flex" alignItems="center">
            <ProgressCircle progress={progress} />
            {increase && (
              <Typography
                variant="body2"
                sx={{ color: colors.greenAccent[500] }}
              >
                {increase}
              </Typography>
            )}
          </Box>
        )}
      </Box>
      
      <Box mt={2}>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          Word of the Day
        </Typography>
        <Typography variant="h5" component="div">
          {word}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {partOfSpeech}
        </Typography>
        <Typography variant="body2">
          {definition}
          <br />
          {`"${example}"`}
        </Typography>
      </Box>
    </Box>
  );
};

export default DetailsBox;
