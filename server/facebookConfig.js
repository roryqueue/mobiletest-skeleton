ServiceConfiguration.configurations.upsert(
  { service: "facebook" },
  {
    $set: {
      appId: "529298087202044",
      loginStyle: "redirect",
      secret: "a9cb97769c3e897dd8faabcaab55aeef"
    }
  }
);
