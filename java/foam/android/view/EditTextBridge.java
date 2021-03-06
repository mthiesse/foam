package foam.android.view;

import android.content.Context;
import android.util.AttributeSet;
import android.widget.EditText;

/**
 * FOAM wrapper for Android's {@link EditText} for editing {@link String}s.
 */
public class EditTextBridge extends AbstractEditTextBridge<String> {
  public EditTextBridge(Context context) {
    super(context);
  }
  public EditTextBridge(Context context, AttributeSet attrs) {
    super(context, attrs);
  }

  @Override
  protected String convertStringToValue(String s) {
    return s;
  }

  protected void updateViewFromValue() {
    view.getEditText().setText(value.get());
  }
}
