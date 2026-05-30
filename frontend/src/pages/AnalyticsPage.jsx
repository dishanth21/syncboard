import { useEffect, useState } from "react";
import api from "../services/api";

function AnalyticsPage() {

  const [data, setData] =
    useState(null);

  useEffect(() => {

    loadAnalytics();

  }, []);

  async function loadAnalytics() {

    try {

      const response =
        await api.get(
          "/analytics"
        );

      setData(
        response.data
      );

    } catch {

      console.log(
        "Analytics failed"
      );

    }

  }

  if (!data) {

    return (

      <div>

        Loading...

      </div>

    );

  }

  return (

    <div
      style={{

        background:"#0f172a",

        color:"white",

        minHeight:"100vh",

        padding:"40px"

      }}
    >

      <h1>

        Analytics Dashboard

      </h1>

      <div
        style={{

          display:"flex",

          gap:"20px",

          marginTop:"30px"

        }}
      >

        <Card
          title="Total Tasks"
          value={data.totalTasks}
        />

        <Card
          title="Completed"
          value={data.completedTasks}
        />

        <Card
          title="Completion %"
          value={data.completionRate}
        />

      </div>

    </div>

  );

}

function Card({

  title,

  value

}) {

  return (

    <div
      style={{

        background:"#1e293b",

        padding:"20px",

        borderRadius:"12px",

        width:"220px"

      }}
    >

      <h3>

        {title}

      </h3>

      <h1>

        {value}

      </h1>

    </div>

  );

}

export default AnalyticsPage;