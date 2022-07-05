import {
  Box,
  Flex,
  Text,
  SimpleGrid,
  useColorModeValue,
} from "@chakra-ui/react";
import { Header } from "../components/Header";
import { Sidebar } from "../components/Sidebar";
import dynamic from "next/dynamic";
import Head from "next/head";
import { withSSRAuth } from "../util/withSSRAuth";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function Dashboard() {
  const bg = useColorModeValue("gray.50", "gray.900");

  const options: any = {
    chart: {
      height: 350,
      type: "area",
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      type: "datetime",
      categories: [
        "2018-09-19T00:00:00.000Z",
        "2018-09-19T01:30:00.000Z",
        "2018-09-19T02:30:00.000Z",
        "2018-09-19T03:30:00.000Z",
        "2018-09-19T04:30:00.000Z",
        "2018-09-19T05:30:00.000Z",
        "2018-09-19T06:30:00.000Z",
      ],
    },
    tooltip: {
      x: {
        format: "dd/MM/yy HH:mm",
      },
    },
  };

  const series = [
    {
      name: "series1",
      data: [31, 40, 28, 51, 42, 109, 100],
    },
    {
      name: "series2",
      data: [11, 32, 45, 32, 34, 52, 41],
    },
  ];

  const series2 = [
    {
      data: [21, 22, 10, 28, 16, 21, 13, 30],
    },
  ];

  const options2: any = {
    chart: {
      height: 350,
      type: "bar",
      events: {
        click: function (chart, w, e) {
          // console.log(chart, w, e)
        },
      },
    },
    plotOptions: {
      bar: {
        columnWidth: "45%",
        distributed: true,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: false,
    },
    xaxis: {
      categories: [
        ["John", "Doe"],
        ["Joe", "Smith"],
        ["Jake", "Williams"],
        "Amber",
        ["Peter", "Brown"],
        ["Mary", "Evans"],
        ["David", "Wilson"],
        ["Lily", "Roberts"],
      ],
      labels: {
        style: {
          fontSize: "12px",
        },
      },
    },
  };

  return (
    <Flex direction="column" h="100vh">
      <Head>
        <title>Dashboard | Supply</title>
      </Head>

      <Header />
      <Flex w="95%" my="6" maxWidth={1480} mx="auto" px={["0", "2", "6"]}>
        <Sidebar />
        <SimpleGrid
          flex="1"
          gap="4"
          minChildWidth="320px"
          alignContent="center"
        >
          <Box pb="4" p={["6", "8"]} borderRadius={8} bg={bg}>
            <Text fontSize={["md", "md", "lg"]} mb="4">
              Gráfico
            </Text>
            <ApexCharts
              options={options}
              series={series}
              type="area"
              height={200}
              heigth={160}
            />
          </Box>

          <Box pb="4" p={["6", "8"]} borderRadius={8} bg={bg}>
            <Text fontSize={["md", "md", "lg"]} mb="4">
              Gráfico
            </Text>
            <ApexCharts
              options={options2}
              series={series2}
              type="bar"
              height={200}
              heigth={160}
            />
          </Box>
        </SimpleGrid>
      </Flex>
    </Flex>
  );
}

export const getServerSideProps = withSSRAuth(async (ctx) => {
  return {
    props: {},
  };
});
