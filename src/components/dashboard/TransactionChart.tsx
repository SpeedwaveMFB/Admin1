import { Card, CardContent, Typography } from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

interface TransactionChartProps {
  data: Array<{
    date: string;
    deposits: number;
    withdrawals: number;
    transfers: number;
  }>;
}

export default function TransactionChart({ data }: TransactionChartProps) {
  return (
    <Card elevation={2}>
      <CardContent>
        <Typography variant="h6" fontWeight={600} gutterBottom>
          Transaction Volume
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="deposits"
              stroke="#10B981"
              name="Deposits"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="withdrawals"
              stroke="#F59E0B"
              name="Withdrawals"
              strokeWidth={2}
            />
            <Line
              type="monotone"
              dataKey="transfers"
              stroke="#6B46C1"
              name="Transfers"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

