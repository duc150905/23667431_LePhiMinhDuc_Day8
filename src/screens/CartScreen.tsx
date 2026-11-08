import React, { useState } from "react";
import { FlatList, Modal, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import { TodoBox } from "../components/TodoBox";
import { Header } from "../components/Header";
import { CartItemRow } from "../components/CartItemRow";
import { PrimaryButton } from "../components/PrimaryButton";

import { EmptyState } from "../components/EmptyState";
import { useAuth, useCart } from "../store/hooks";
import { confirmDialog } from "../utils/dialog"; // đã viết sẵn — dùng ở BT8.7a
import { TabScreenProps } from "../navigation/types";
import { colors, formatPrice, radius } from "../theme";

export function CartScreen({ navigation }: TabScreenProps<"Cart">) {
  const { isLoggedIn } = useAuth();
  const { items, totalPrice, setQty, remove } = useCart();
  const [deleteTarget, setDeleteTarget] = useState<{ id: number; title: string } | null>(null);
  const finalTotal = totalPrice; // TODO BT8.C2 (thử thách): trừ mã giảm giá → finalTotal = totalPrice - discount

  const askRemove = (bookId: number) => {
    const item = items.find((i) => i.bookId === bookId);
    const title = item?.title ?? "sản phẩm";
    if (Platform.OS === "web") {
      setDeleteTarget({ id: bookId, title });
    } else {
      confirmDialog("Xóa sản phẩm", `Xóa "${title}" khỏi giỏ hàng?`, () => remove(bookId));
    }
  };

  const goCheckout = () => {
    if (isLoggedIn) {
      navigation.navigate("Checkout", { total: finalTotal });
    } else {
      navigation.navigate("Login", { redirectTo: "Checkout", total: finalTotal });
    }
  };

  return (
    <View style={styles.container}>
      <Header title="🛒 Giỏ hàng" />
      <FlatList
        data={items}
        keyExtractor={(i) => String(i.bookId)}
        renderItem={({ item }) => <CartItemRow item={item} onChangeQty={setQty} onRemove={askRemove} />}
        contentContainerStyle={{ paddingVertical: 8, flexGrow: 1 }}
        ListEmptyComponent={
          <EmptyState emoji="🛒" title="Giỏ hàng trống" message="Hãy chọn vài cuốn sách yêu thích nhé." actionLabel="Khám phá sách" onAction={() => navigation.navigate("Home")} />
        }
      />
      {items.length > 0 && (
        <View style={styles.footer}>
          <TodoBox id="BT8.C2">{"THỬ THÁCH: ô nhập mã giảm giá (SALE10 giảm 10%, GIAM50K giảm 50.000đ) + dòng “Giảm giá” + tổng cộng mới."}</TodoBox>
          <View style={styles.line}><Text style={styles.muted}>Tạm tính</Text><Text style={styles.value}>{formatPrice(totalPrice)}</Text></View>
          <View style={styles.line}><Text style={styles.total}>Tổng cộng</Text><Text style={styles.total}>{formatPrice(finalTotal)}</Text></View>
          <PrimaryButton title="Thanh toán" onPress={goCheckout} />
        </View>
      )}

      {/* Hộp thoại xác nhận xóa in-app cho nền Web và Mobile */}
      <Modal
        visible={!!deleteTarget}
        transparent
        animationType="fade"
        onRequestClose={() => setDeleteTarget(null)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Xóa sản phẩm</Text>
            <Text style={styles.modalMsg}>Xóa "{deleteTarget?.title}" khỏi giỏ hàng?</Text>
            <View style={styles.modalActions}>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnCancel]}
                onPress={() => setDeleteTarget(null)}
              >
                <Text style={styles.modalCancelText}>Hủy</Text>
              </Pressable>
              <Pressable
                style={[styles.modalBtn, styles.modalBtnDelete]}
                onPress={() => {
                  if (deleteTarget) remove(deleteTarget.id);
                  setDeleteTarget(null);
                }}
              >
                <Text style={styles.modalDeleteText}>Xóa</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  footer: { backgroundColor: "#fff", padding: 14, gap: 8, borderTopWidth: 1, borderTopColor: colors.line },
  line: { flexDirection: "row", justifyContent: "space-between" },
  muted: { color: colors.muted },
  value: { fontWeight: "700", color: colors.text },
  total: { fontSize: 17, fontWeight: "800", color: colors.navy },
  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.45)", justifyContent: "center", alignItems: "center", padding: 20 },
  modalBox: { backgroundColor: "#fff", borderRadius: radius.lg, padding: 20, width: "100%", maxWidth: 320, gap: 12, alignItems: "center", elevation: 5, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
  modalTitle: { fontSize: 18, fontWeight: "800", color: colors.navy },
  modalMsg: { fontSize: 14, color: colors.text, textAlign: "center", lineHeight: 20 },
  modalActions: { flexDirection: "row", gap: 12, width: "100%", marginTop: 6 },
  modalBtn: { flex: 1, paddingVertical: 10, borderRadius: radius.md, alignItems: "center", justifyContent: "center" },
  modalBtnCancel: { borderWidth: 1, borderColor: colors.line, backgroundColor: "#fff" },
  modalCancelText: { fontWeight: "700", color: colors.text },
  modalBtnDelete: { backgroundColor: colors.danger },
  modalDeleteText: { fontWeight: "800", color: "#fff" },
});
