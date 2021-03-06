package foam.android.view;

import android.content.Context;
import android.support.design.widget.TextInputLayout;
import android.util.AttributeSet;
import android.widget.EditText;

/**
 * Wraps an {@link EditText} (actually {@link TextInputLayout}) with conversion to and from
 * an integer.
 */
public class EditIntBridge extends AbstractEditTextBridge<Integer> {
  public EditIntBridge(Context context) {
    super(context);
  }
  public EditIntBridge(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  @Override
  protected Integer convertStringToValue(String s) {
    return Integer.parseInt(s);
  }

  @Override
  protected void updateViewFromValue() {
    view.getEditText().setText(value.get().toString());
  }

  // TODO(braden): Override other TextWatcher calls to disallow entering non-numeric values.
}
