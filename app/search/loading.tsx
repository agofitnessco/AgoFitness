import Grid from "components/grid";

export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-12 lg:px-8">
      <div className="mb-8 h-24" />
      <Grid className="grid-cols-2 lg:grid-cols-4">
        {Array(12)
          .fill(0)
          .map((_, index) => {
            return (
              <Grid.Item
                key={index}
                className="animate-pulse rounded-lg bg-neutral-100"
              />
            );
          })}
      </Grid>
    </div>
  );
}
