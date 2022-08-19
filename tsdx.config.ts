import postcss from "rollup-plugin-postcss";

export default {
  rollup(config: any, options: any) {
    config.plugins.push(
      postcss({
        modules: false,
        inject: true,
        extract: false,
      })
    );
    return config;
  },
};
