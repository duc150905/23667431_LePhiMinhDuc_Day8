import React, { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import { TodoBox } from "../components/TodoBox";
import { FormField } from "../components/FormField";
import { PrimaryButton } from "../components/PrimaryButton";
import { login } from "../services/authService"; // đã viết sẵn: login(email, password) → { user, token }
import { getErrorMessage } from "../api/client";
import { useAuth } from "../store/hooks";
import { validateEmail, validatePassword } from "../utils/validators"; // đã viết sẵn: trả về chuỗi lỗi hoặc null
import { RootScreenProps } from "../navigation/types";
import { colors } from "../theme";

export function LoginScreen({ navigation, route }: RootScreenProps<"Login">) {
  const { signIn } = useAuth();
  // TODO BT8.1: khai báo state: email, password, errors, submitError, loading
  //   gợi ý: const [errors, setErrors] = useState<{ email?: string | null; password?: string | null }>({});

  // TODO BT8.1: viết hàm submit
  //   1) validate 2 ô → setErrors; còn lỗi thì dừng
  //   2) setLoading(true) → gọi login(email, password) → signIn(user, token)
  //   3) nếu route.params?.redirectTo === "Checkout" → navigation.replace("Checkout", { total: route.params.total ?? 0 })
  //      ngược lại → navigation.navigate("Tabs", { screen: "Home" })
  //   4) catch → setSubmitError(getErrorMessage(err)); finally → setLoading(false)

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={styles.logo}>📚</Text>
        <Text style={styles.title}>Đăng nhập BookStore</Text>

        <TodoBox id="BT8.1">{"Form đăng nhập: 2 ô FormField (Email, Mật khẩu — secureTextEntry), lỗi hiện NGAY DƯỚI từng ô, dòng lỗi chung (đỏ), nút PrimaryButton “Đăng nhập” có loading."}</TodoBox>

        <Pressable onPress={() => navigation.replace("Register", route.params)}>
          <Text style={styles.link}>Chưa có tài khoản? Đăng ký</Text>
        </Pressable>
        <View style={styles.hint}>
          <Text style={styles.hintText}>Tài khoản demo: demo@bookstore.vn / 123456</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 20, gap: 14 },
  logo: { fontSize: 56, textAlign: "center" },
  title: { fontSize: 22, fontWeight: "800", color: colors.navy, textAlign: "center", marginBottom: 6 },
  submitError: { color: colors.danger, textAlign: "center" },
  link: { color: colors.indigo, fontWeight: "700", textAlign: "center" },
  hint: { backgroundColor: "#E0F2FE", padding: 10, borderRadius: 10 },
  hintText: { color: colors.navy, textAlign: "center", fontSize: 12 },
});
