function DivWrap({ children }) {
  return <div>{children}</div>;
}

function View({ children }) {
  return <DivWrap>{children}</DivWrap>;
}

module.exports = () => {
  return (
    <View>
      <View>
        <div />
      </View>
    </View>
  );
};
