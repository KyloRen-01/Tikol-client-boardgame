import { Component, type ErrorInfo, type ReactNode } from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { diagError } from "./diagnosticLog";

type State = { error: Error | null; info: ErrorInfo | null };

export class DiagnosticErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null, info: null };

  static getDerivedStateFromError(error: Error) {
    return { error, info: null };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    diagError("render.error-boundary", { error, componentStack: info.componentStack });
    this.setState({ error, info });
  }

  render() {
    const { error, info } = this.state;
    if (!error) return this.props.children;

    return (
      <ScrollView contentContainerStyle={styles.root}>
        <Text style={styles.title}>TIKOL startup crash captured</Text>
        <Text style={styles.label}>Message</Text>
        <Text style={styles.text}>{error.message}</Text>
        <Text style={styles.label}>Stack</Text>
        <Text style={styles.text}>{error.stack}</Text>
        <Text style={styles.label}>Component stack</Text>
        <Text style={styles.text}>{info?.componentStack}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  root: { backgroundColor: "#101625", flexGrow: 1, padding: 18, paddingTop: 56 },
  title: { color: "#ffb12d", fontSize: 20, fontWeight: "900", marginBottom: 14 },
  label: { color: "#76db8b", fontSize: 13, fontWeight: "900", marginTop: 12 },
  text: { color: "#fff", fontFamily: "monospace", fontSize: 12, lineHeight: 17 },
});
