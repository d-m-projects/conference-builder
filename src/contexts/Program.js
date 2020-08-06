const Program = {
  Name: "",
  DateStart: null,
  DateEnd: null,
  Days: [],
};

const DemoProgram = {
  Name: "New Directions in Cardiology 2020",
  DateStart: new Date(),
  DateEnd: new Date(),
  Days: [
    {
      Date: new Date(),
      Sessions: [
        {
          Name: "Morning Session - Intro Track",
          DatetimeStart: new Date(),
          DatetimeEnd: new Date(new Date().setDate(new Date().getDay() + 1)),
          Presentations: [
            {
              Name: "Prevention techniques",
              Presenters: ["Jane Doe, MD", "John Doe, MD"],
              CreditTypes: ["AMA"],
              CreditValues: [0.25],
            },
            {
              Name: "Repair and ablation",
              Presenters: ["Karin Mared, MD", "Vjera Omid Sadler, MD"],
              CreditTypes: ["AMA"],
              CreditValues: [0.25],
            },
            {
              Name: "Reconstruction and blood flow",
              Presenters: ["Dileep Zebedaios, MD", "Tswb Colette, MD"],
              CreditTypes: ["AMA"],
              CreditValues: [0.25],
            },
            {
              Name: "What went wrong? Postmortum",
              Presenters: ["Luciana Anita, MD"],
              CreditTypes: ["AMA"],
              CreditValues: [0.25],
            },
          ],
        },
      ],
    },
  ],
};

export default Program;

export { DemoProgram };
